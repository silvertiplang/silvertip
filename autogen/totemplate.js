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
    function recurse(node) {
        switch (typeMap[node.type]) {
            case 'breakStatement': {

                break;
            }
            case 'continueStatement': {

                break;
            }
            case 'returnStatement': {

                break;
            }
            case 'ifStatement': {

                break;
            }
            case 'ifClause': {

                break;
            }
            case 'elseIfClause': {

                break;
            }
            case 'elseClause': {

                break;
            }
            case 'whileStatement': {

                break;
            }
            case 'repeatStatement': {

                break;
            }
            case 'localStatement': {

                break;
            }
            case 'globalStatement': {

                break;
            }
            case 'callStatement': {

                break;
            }
            case 'localFunctionDeclaration': {

                break;
            }
            case 'globalFunctionDeclaration': {

                break;
            }
            case 'assignmentFunctionDeclaration': {

                break;
            }
            case 'forNumericStatement': {

                break;
            }
            case 'forGenericStatement': {

                break;
            }
            case 'chunk': {

                break;
            }
            case 'asyncStatement': {

                break;
            }
            case 'identifier': {

                break;
            }
            case 'literal': {

                break;
            }
            case 'tableEntry': {

                break;
            }
            case 'arrayConstructorExpression': {

                break;
            }
            case 'tableConstructorExpression': {

                break;
            }
            case 'binaryExpression': {

                break;
            }
            case 'unaryExpression': {

                break;
            }
            case 'indexExpression': {

                break;
            }
            case 'lambdaExpression': {

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

    recurse(ast);

    return out;
}



module.exports = tojs