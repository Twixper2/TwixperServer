/**
 * select group with respect to the group size in percentage
**/ 
function selectGroup(expGroups) {
    const expanded = expGroups.flatMap(group => Array(group.group_size_in_percentage).fill(group))
    const winnerGroup = expanded[Math.floor(Math.random() * expanded.length)];
    return winnerGroup
}

exports.selectGroup = selectGroup