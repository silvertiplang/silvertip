/*
    tojs

    generate js code from ast
*/

const ast = require("./ast");
const { generateASTDecode, error } = require("./utils");


let typeMap = generateASTDecode(ast);

function tojs(ast) {
    // traverse ast and output
    let out = '';
    let globals = {};

    // let state = {
    //     // If there is no way that it is multiple, false. If there is a slight possibility that it is multiple, true.
    //     lambdaReturnMultiple: null,
    // };

    // function scanReturn(node) {
    //     if (node.body) {
    //         for (let i = 0; i < node.body.length; i++) {
    //             let o = scanReturn(node.body[i]);
    //             if (o) {
    //                 return true;
    //             }
    //         }
    //         return false;
    //     } else {
    //         if (typeMap[node.type] == 'returnStatement') {
    //             if (node.arguments.length > 1) {
    //                 return true;
    //             } else if (node.arguments.length == 0) {
    //                 return false;
    //             } else { // == 1
    //                 if (typeMap[node.arguments[0].type] == 'callStatement') {
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //         } else {
    //             return false;
    //         }
    //     }
    // }

    function recurse(node) {
        switch (typeMap[node.type]) {
            case 'breakStatement': {
                out += 'break';
                break;
            }
            case 'continueStatement': {
                out += 'continue';
                break;
            }
            case 'returnStatement': {
                out += 'return ';
                if (state.lambdaReturnMultiple) {
                    out += '[';
                    for (let i = 0; i < node.arguments.length; i++) {
                        let argument = node.arguments[i];
                        if (typeMap[argument.type] == 'callStatement') {
                            recurse(argument);
                        } else {
                            recurse(argument);
                        }
                        if (i != node.arguments.length - 1) {
                            out += ',';
                        }
                    }
                    out += ']';
                } else {
                    recurseList(node.arguments);
                }
                break;
            }
            case 'ifStatement': {
                recurseConcat(node.clauses);
                break;
            }
            case 'ifClause': {
                out += 'if(';
                recurse(node.condition);
                out += '){';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'elseIfClause': {
                out += 'else if(';
                recurse(node.condition);
                out += '){';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'elseClause': {
                out += 'else{';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'whileStatement': {
                out += 'while(';
                recurse(node.condition);
                out += '){';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'repeatStatement': {
                out += 'do{';
                recurseBody(node.body);
                out += '}while(!';
                recurse(node.condition);
                out += ')';
                break;
            }
            case 'localStatement': {
                out += 'let ';
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    if (init) {
                        recurse(variable);
                        out += '=';
                        recurse(init);
                    } else {
                        recurse(variable);
                    }
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                break;
            }
            case 'globalStatement': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    globals[variable.name] = true; // DIRTY
                    if (init) {
                        recurse(variable);
                        out += '=';
                        recurse(init);
                    } else {
                        recurse(variable);
                    }
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable);
                    out += '=';
                    recurse(init);
                    if (i != length - 1) {
                        out += ';';
                    }
                }
                break;
            }
            case 'operationAssignment': {
                // TODO: Optimize
                
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable);
                    out += node.operation;
                    // TODO: ||, && fix
                    out += '=';
                    recurse(init);
                    if (i != length - 1) {
                        out += ';';
                    }
                }
                break;
            }
            case 'callStatement': {
                recurse(node.base);
                out += '(';
                recurseList(node.arguments);
                out += ')';
                break;
            }
            case 'forNumericStatement': {
                out += 'for(let ';
                recurse(node.variable);
                out += '=';
                recurse(node.start);
                out += ';';
                recurse(node.variable);
                out += '<=';
                recurse(node.end);
                out += ';';
                recurse(node.variable);
                out += '+=';
                recurse(node.step);
                out += '){';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'forGenericStatement': {
                out += 'for(const[';
                if (node.keyVariable) {
                    recurse(node.keyVariable);
                }
                out += ',';
                recurse(node.valueVariable);
                out += ']of Object.entries(';
                recurse(node.objectVariable);
                out += ')){';
                recurseBody(node.body);
                out += '}';
                break;
            }
            case 'chunk': {
                recurseBody(node.body);
                break;
            }
            case 'asyncStatement': {
                out += '(async()=>{';
                recurseBody(node.body);
                out += '})()';
                break;
            }
            case 'identifier': {
                if (globals[node.name]) {
                    out += '_G.';
                }
                out += node.name;
                break;
            }
            case 'stringLiteral': {
                out += '\'';
                out += node.value;
                out += '\'';
                break;
            }
            case 'numericLiteral': {
                out += node.value;
                break;
            }
            case 'booleanLiteral': {
                out += node.value;
                break;
            }
            case 'nullLiteral': {
                out += 'null';
                break;
            }
            case 'varargLiteral': {
                // ATODO
                break;
            }
            case 'tableEntry': {
                out += '[';
                recurse(node.key);
                out += ']:';
                recurse(node.value);
                break;
            }
            case 'arrayConstructorExpression': {
                out += '[';
                recurseList(node.list);
                out += ']';
                break;
            }
            case 'tableConstructorExpression': {
                out += '{';
                recurseList(node.fields);
                out += '}';
                break;
            }
            case 'logicalExpression': {
                out += '(';
                recurse(node.left);
                out += node.operator;
                recurse(node.right);
                out += ')';
                break;
            }
            case 'binaryExpression': {
                out += '(';
                recurse(node.left);
                out += node.operator;
                recurse(node.right);
                out += ')';
                break;
            }
            case 'unaryExpression': {
                out += '(';
                out += node.operator;
                recurse(node.argument);
                out += ')';
                break;
            }
            case 'indexExpression': {
                recurse(node.base);
                out += '[';
                recurse(node.index);
                out += ']';
                break;
            }
            case 'lambdaExpression': {
                out += '(';
                recurseList(node.parameters);
                out += ')=>{';

                // scan for return statements and check number
                let oldState = state.lambdaReturnMultiple;
                state.lambdaReturnMultiple = scanReturn(node);

                recurseBody(node.body);

                state.lambdaReturnMultiple = oldState;

                out += '}'
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
    function recurseConcat(list) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i]);
        }
    }
    function recurseList(list) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i]);
            if (i != list.length - 1) {
                out += ',';
            }
        }
    }
    function recurseBody(list) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i]);
            if (i != list.length - 1) {
                out += ';';
            }
        }
    }

    out += 'const _G={};';

    // silvertip js runtime
    out += `// silvertip js runtime
print = console.log;
`

    recurse(ast);

    return out;
}



module.exports = tojs;