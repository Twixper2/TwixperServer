var chai = require('chai')
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var assert = chai.assert
var expect = chai.expect;

exports.chai = chai
exports.assert = assert
exports.expect = expect