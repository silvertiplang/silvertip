/*
    tolua

    generate lua code from ast
*/

const ast = require("./ast");
const { generateASTDecode, error } = require("./utils");


let typeMap = generateASTDecode(ast);

function tolua(ast) {
    // traverse ast and output
    let out = '';
    let globals = {};
    function recurse(node) {
        switch (typeMap[node.type]) {
            case 'breakStatement': {
                out += 'break';
                break;
            }
            case 'continueStatement': {
                // TODO
                // out += 'continue';
                break;
            }
            case 'returnStatement': {
                out += 'return ';
                recurseList(node.arguments);
                break;
            }
            case 'ifStatement': {
                recurseConcat(node.clauses);
                break;
            }
            case 'ifClause': {
                out += 'if(';
                recurse(node.condition);
                out += ')then ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'elseIfClause': {
                out += 'elseif(';
                recurse(node.condition);
                out += ')then ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'elseClause': {
                out += 'else ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'whileStatement': {
                out += 'while(';
                recurse(node.condition);
                out += ')do ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'repeatStatement': {
                out += 'repeat ';
                recurseBody(node.body);
                out += 'until ';
                recurse(node.condition);
                break;
            }
            case 'localStatement': {
                out += 'local ';
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    recurse(variable);
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                out += '=';
                for (let i = 0; i < node.init.length; i++) {
                    let init = node.init[i];
                    recurse(init);
                    if (i != node.init.length - 1) {
                        out += ',';
                    }
                }
                break;
            }
            case 'globalStatement': {
                // out += '';
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    recurse(variable);
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                out += '=';
                for (let i = 0; i < node.init.length; i++) {
                    let init = node.init[i];
                    recurse(init);
                    if (i != node.init.length - 1) {
                        out += ',';
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    recurse(variable);
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                out += '=';
                for (let i = 0; i < node.init.length; i++) {
                    let init = node.init[i];
                    recurse(init);
                    if (i != node.init.length - 1) {
                        out += ',';
                    }
                }
                break;
            }
            case 'operationAssignment': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    recurse(variable);
                    if (i != node.variables.length - 1) {
                        out += ',';
                    }
                }
                out += '=';
                let operation = node.operation;
                for (let i = 0; i < node.init.length; i++) {
                    let variable = node.variables[i];
                    out += variable + operation;
                    let init = node.init[i];
                    recurse(init);
                    if (i != node.init.length - 1) {
                        out += ',';
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
                out += 'for ';
                recurse(node.variable);
                out += '=';
                recurse(node.start);
                out += ',';
                recurse(node.end);
                out += ',';
                recurse(node.step);
                out += ' do ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'forGenericStatement': {
                out += 'for ';
                if (node.keyVariable) {
                    recurse(node.keyVariable);
                } else {
                    out += '____________________UNUSED_';
                }
                out += ',';
                recurse(node.valueVariable);
                out += ' in pairs(';
                recurse(node.objectVariable);
                out += ')do ';
                recurseBody(node.body);
                out += ' end';
                break;
            }
            case 'chunk': {
                recurseBody(node.body);
                break;
            }
            case 'asyncStatement': {
                // TODO
                // out += '(async()=>{';
                // recurseBody(node.body);
                // out += '})()';
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
                out += 'nil';
                break;
            }
            case 'varargLiteral': {
                // ATODO
                break;
            }
            case 'tableEntry': {
                out += '[';
                recurse(node.key);
                out += ']=';
                recurse(node.value);
                break;
            }
            case 'arrayConstructorExpression': {
                out += '{[0]=';
                recurseList(node.list);
                out += '}';
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
                out += 'function(';
                recurseList(node.parameters);
                out += ')';
                recurseBody(node.body);
                out += ' end'
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
                out += ' ';
            }
        }
    }


    recurse(ast);

    return out;
}



module.exports = tolua;