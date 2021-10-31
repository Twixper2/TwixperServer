import logging

import azure.functions as func

import json
import re
import time
import requests


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    try:
        guest_token = refresh()
        if guest_token is not None:
            res_body = {"guest_token": guest_token}
            return func.HttpResponse(
                body=json.dumps(res_body),
                status_code=200
            )
        else:
            return func.HttpResponse(
                "Error while getting the guest token",
                status_code=502
            )
    except Exception as e:
        return func.HttpResponse(
            str(e),
            status_code=500
        )

    # name = req.params.get('name')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    # if name:
    #     return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    # else:
    #     return func.HttpResponse(
    #         "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #         status_code=200
    #     )


def _perform_request():
    _session = requests.Session()
    _session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0'})
    _retries = 5
    _timeout = 10
    url = 'https://twitter.com'
    for attempt in range(_retries + 1):
        # The request is newly prepared on each retry because of potential cookie updates.
        req = _session.prepare_request(requests.Request('GET', url))
        logging.info(f'Retrieving {req.url}')
        try:
            r = _session.send(req, allow_redirects=True, timeout=_timeout)
        except requests.exceptions.RequestException as exc:
            if attempt < _retries:
                retrying = ', retrying'
                level = "WARNING: "
            else:
                retrying = ''
                level = "ERROR: "
            logging.info(level + f'Error retrieving {req.url}: {exc!r}{retrying}')
        else:
            success, msg = (True, None)
            msg = f': {msg}' if msg else ''

            if success:
                logging.info(f'{req.url} retrieved successfully{msg}')
                return r
        if attempt < _retries:
            # TODO : might wanna tweak this back-off timer
            sleep_time = 2.0 * 2 ** attempt
            logging.info(f'Waiting {sleep_time:.0f} seconds')
            time.sleep(sleep_time)
    else:
        msg = f'{_retries + 1} requests to {url} failed, giving up.'
        logging.info("FATAL: " + msg)
        Guest_token = None
        raise ValueError(str(msg))

def refresh():
    logging.info('Retrieving guest token')
    res = _perform_request()
    match = re.search(r'\("gt=(\d+);', res.text)
    if match:
        logging.info('Found guest token in HTML')
        Guest_token = str(match.group(1))
    else:
        Guest_token = None
        raise ValueError('Could not find the Guest token in HTML')
    return Guest_token