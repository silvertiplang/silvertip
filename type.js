/*
    type.js

    add types to ast, type inference
*/

const ast = require("./ast");
const { generateASTDecode, error } = require("./utils");


let typeMap = generateASTDecode(ast);



function type(ast) {



    
    function recurse(node) {
        switch (typeMap[node.type]) {
            case 'breakStatement': {
                out += ';break;';
                break;
            }
            case 'continueStatement': {
                out += ';continue;';
                break;
            }
            case 'returnStatement': {
                out += ';return ';
                recurseList(node.arguments, true);
                out += ';';
                break;
            }
            case 'ifStatement': {
                recurseList(node.clauses);
                break;
            }
            case 'ifClause': {
                out += ';if(';
                recurse(node.condition);
                out += '){';
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'elseIfClause': {
                out += 'else if(';
                recurse(node.condition);
                out += '){';
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'elseClause': {
                out += 'else{';
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'whileStatement': {
                out += ';while(';
                recurse(node.condition);
                out += '){'
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'repeatStatement': {
                out += ';do{'
                recurseList(node.body);
                out += '}while(!';
                recurse(node.condition);
                out += ');';
                break;
            }
            case 'localStatement': {
                out += ';let '
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
                out += ';';
                break;
            }
            case 'globalStatement': {
                out += ';'
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
                out += ';';
                break;
            }
            case 'assignmentStatement': {
                out += ';';
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable);
                    out += '=';
                    recurse(init);
                    out += ';';
                }
                break;
            }
            case 'operationAssignment': {
                // TODO: Optimize
                
                out += ';';
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable);
                    out += node.operation;
                    // TODO: ||, && fix
                    out += '=';
                    recurse(init);
                    out += ';';
                }
                break;
            }
            case 'callStatement': {
                recurse(node.base);
                out += '(';
                recurseList(node.arguments, true);
                out += ')';
                break;
            }
            case 'forNumericStatement': {
                out += ';for(let ';
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
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'forGenericStatement': {
                out += ';for(const[';
                if (node.keyVariable) {
                    recurse(node.keyVariable);
                }
                out += ',';
                recurse(node.valueVariable);
                out += ']of Object.entries(';
                recurse(node.objectVariable);
                out += ')){';
                recurseList(node.body);
                out += '}';
                break;
            }
            case 'chunk': {
                recurseList(node.body);
                break;
            }
            case 'asyncStatement': {
                out += ';(async()=>{';
                recurseList(node.body);
                out += '})();';
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
                recurseList(node.list, true);
                out += ']';
                break;
            }
            case 'tableConstructorExpression': {
                out += '{';
                recurseList(node.fields, true);
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
                recurseList(node.parameters, true);
                out += ')=>{';
                recurseList(node.body);
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
    function recurseList(list, addCommas) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i]);
            if (addCommas && i != list.length - 1) {
                out += ',';
            }
        }
    }

    recurse(ast);

    return out;



}

module.exports = type;