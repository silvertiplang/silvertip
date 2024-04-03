/*
    type.js

    add types to ast, type inference
*/

const ast = require("./ast");
const { generateASTDecode, error } = require("./utils");


let typeMap = generateASTDecode(ast);


let opTypes = {
    '+': ['number', 'string'], // number or string
    '-': ['number'],
    '*': ['number'],
    '/': ['number'],
    '%': ['number'],
    '^': ['number'],
    '==': ['boolean'],
    '!=': ['boolean'],
    '<': ['boolean'],
    '<=': ['boolean'],
    '>': ['boolean'],
    '>=': ['boolean'],
    '&&': ['boolean'],
    '||': ['boolean'],
    '!': ['boolean'],
};

let types = {
    number: function() {
        return {
            type: 'number'
        };
    },
    string: function() {
        return {
            type: 'string'
        };
    },
    boolean: function() {
        return {
            type: 'boolean'
        };
    },
    function: function() {
        return {
            type: 'function'
        };
    },
    null: function() {
        return {
            type: 'null'
        };
    },
    array: function() {
        return {
            type: 'array'
        };
    },
    table: function() {
        return {
            type: 'table'
        };
    },
    undefined: function() {
        return {
            type: 'undefined'
        };
    },
};

// Finds intersection of set a and b
function intersection(a, b) {
    let out = [];
    for (let i = 0; i < a.length; i++) {
        let a1 = a[i];
        for (let i2 = 0; i2 < b.length; i2++) {
            let b1 = b[i2];
            if (a1 === b1) {
                out.push(a1);
                break;
            }
        }
    }
    return out;
}


function type(ast) {
    /*
    types are stored under node.t
    array of potential types are stored under note.pt (node.t is null when potential types, when decided, node.t will be set)
    scopes are stored under node.s

    t {
        type: ('number', 'string', 'boolean', 'function', 'null', 'undefined' (TBD), 'array', 'table'),
        potential: [types, ...],
    }
    */

    // Current state
    let state = {
        // Current scope
        scope: {}
    };


    // Sets node.t and deletes potential if theres only one potential type
    function checkPotential(node) {
        if (node.t.potential && node.t.potential.length == 1) {
            node.t = types[node.pt[0]]();
        }
    }

    
    function recurse(node) {
        switch (typeMap[node.type]) {
            case 'breakStatement': {
                break;
            }
            case 'continueStatement': {
                break;
            }
            case 'returnStatement': {
                recurseList(node.arguments);
                break;
            }
            case 'ifStatement': {
                recurseList(node.clauses);
                break;
            }
            case 'ifClause': {
                recurse(node.condition);
                recurseChunk(node, node.body);
                break;
            }
            case 'elseIfClause': {
                recurse(node.condition);
                recurseChunk(node, node.body);
                break;
            }
            case 'elseClause': {
                recurseChunk(node, node.body);
                break;
            }
            case 'whileStatement': {
                recurse(node.condition);
                recurseChunk(node, node.body);
                break;
            }
            case 'repeatStatement': {
                recurseChunk(node, node.body);
                recurse(node.condition);
                break;
            }
            case 'localStatement': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    variable.t = init ? recurse(init) : types.undefined();
                    state.scope[variable.name] = variable;
                }
                break;
            }
            case 'globalStatement': {
                break;
            }
            case 'assignmentStatement': {
                // ACCOUNT FOR INDEXEXPRESSION ([], .)
                break;
            }
            case 'operationAssignment': {
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    let op = node.operation;
                    let v = state.scope[variable.name];
                    if (!v) {

                    }
                    if (variable.pt) {
                        variable.pt = recurse(init);
                    }
                    state.scope[variable.name] = variable;
                }
                break;
            }
            case 'callStatement': {
                recurse(node.base);
                recurseList(node.arguments, true);
                break;
            }
            case 'forNumericStatement': {
                recurse(node.variable);
                recurse(node.start);
                recurse(node.end);
                recurse(node.step);
                recurseChunk(node, node.body);
                break;
            }
            case 'forGenericStatement': {
                if (node.keyVariable) {
                    recurse(node.keyVariable);
                }
                recurse(node.valueVariable);
                recurse(node.objectVariable);
                recurseChunk(node, node.body);
                break;
            }
            case 'chunk': {
                recurseChunk(node, node.body);
                break;
            }
            case 'asyncStatement': {
                recurseChunk(node, node.body);
                break;
            }
            case 'identifier': {
                node.t = state.scope[node.name].t;
                break;
            }
            case 'stringLiteral': {
                return types.string();
                break;
            }
            case 'numericLiteral': {
                return types.number();
                break;
            }
            case 'booleanLiteral': {
                return types.boolean();
                break;
            }
            case 'nullLiteral': {
                return types.null();
                break;
            }
            case 'varargLiteral': {
                // ATODO
                break;
            }
            case 'tableEntry': {
                recurse(node.key);
                recurse(node.value);
                break;
            }
            case 'arrayConstructorExpression': {
                recurseList(node.list);
                return types.array();
                break;
            }
            case 'tableConstructorExpression': {
                recurseList(node.fields);
                return types.table();
                break;
            }
            case 'logicalExpression': {
                return types.boolean();
                break;
            }
            case 'binaryExpression': {
                recurse(node.left);
                recurse(node.right);
                break;
            }
            case 'unaryExpression': {
                recurse(node.argument);
                if (node.operator == '-') {
                    return types.number();
                }
                break;
            }
            case 'indexExpression': {
                recurse(node.base);
                recurse(node.index);
                break;
            }
            case 'lambdaExpression': {
                recurseList(node.parameters, true);
                recurseChunk(node, node.body);
                return types.function();
                break;
            }
            case 'comment': {

                break;
            }
            case 'whitespace': {

                break;
            }
            default: {

                error(`Unexpected node type '${node.type}'`)
            }
        }
    }
    function recurseList(list) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i]);
        }
    }
    function recurseChunk(node, body) {
        let oldScope = state.scope;
        node.s = structuredClone(state.scope);
        state.scope = node.s;
        for (let i = 0; i < body.length; i++) {
            recurse(body[i]);
        }
        state.scope = oldScope;
    }

    recurse(ast);

    return out;



}

module.exports = type;