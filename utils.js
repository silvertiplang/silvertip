/*
makeMap: Make a map from the values of an array
array: array of values
return: map where you can index it with the value and it will return true
*/
function makeMap(array) {
    let map = {};
    for (let i = 0; i < array.length; i++) {
        map[array[i]] = true;
    }
    return map;
}


/*
error: Cleanly throws an error in the desired format
str: Error message
*/
function error(str) {
    throw new Error(str);
}


module.exports = {makeMap, error}