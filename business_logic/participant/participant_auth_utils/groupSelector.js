/**
 * select group with respect to the group size in percentage
**/ 
function selectGroup(expGroups, totalNumOfParticipants) {
    // const expanded = expGroups.flatMap(group => Array(group.group_size_in_percentage).fill(group))
    // const winnerGroup = expanded[Math.floor(Math.random() * expanded.length)];
    // return winnerGroup
    
    /* TODO: test the following algorithm */

    // Sort the group by size in percentage as chosen by the researcher
    expGroups.sort((a, b) => (a.group_size_in_percentage > b.group_size_in_percentage) ? -1 : 1)
    // Iterate the groups
    for (let i = 0; i < expGroups.length; i++) {
        const group = expGroups[i];
        if(i == expGroups.length - 1){ // The last group
            return group
        }
        const groupNumParticipants = group.group_num_of_participants
        if(groupNumParticipants == 0){
            return group
        }
        /* Calculate the relative size of the group: how many participants does
           the group have in relation to the total number of participants in the exp.*/
        const groupSizeRatio = (groupNumParticipants / totalNumOfParticipants) * 100
        if(groupSizeRatio < group.group_size_in_percentage){
            /* For example, a group has 40% of the  total participants in the experiment,
               but the defined group size in percentage is 50% */
            return group
        }
    }
}

exports.selectGroup = selectGroup