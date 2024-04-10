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
str: error message
*/
function error(str) {
    throw new Error(str);
}



// AST utils

/*
generateASTDecode(ast): Generates a map where the keys are AST types and values are official AST names
return: map of AST type -> official name
*/
function generateASTDecode(ast) {
    // Assumes AST node types are unique (which is a valid assumption)
    let out = {};

    for (const [k, v] of Object.entries(ast)) {
        let type = v().type;
        out[type] = k;
    }

    return out;
}


/*
assignParents(ast): Assign parents to all the nodes except the base node
returns: ast, mutated
*/
function assignParents(ast) {
    function recurse(node) {
        for (const [k, v] of Object.entries(node)) {
            if (typeof v == 'object') {
                if (Array.isArray(v)) {
                    for (let i = 0; i < v.length; i++) {
                        let a = v[i];
                        recurse(a);
                        a.parent = node;
                    }
                } else {
                    recurse(v);
                    v.parent = node;
                }
            }
        }
    }

    recurse(ast);
    return ast;
}



module.exports = {makeMap, error, generateASTDecode, assignParents}