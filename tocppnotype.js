/*
    toc++notype

    generate c++ code from ast, heavily using auto (EXPERIMENTAL)

    TODO:
    multiple function returns
*/

const ast = require("./ast");
const { generateASTDecode, error } = require("./utils");


let typeMap = generateASTDecode(ast);

function tocpp(ast) {
    // traverse ast and output
    let out = '';
    let globals = {};
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
                // TODO
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
                out += ';}';
                break;
            }
            case 'elseIfClause': {
                out += 'else if(';
                recurse(node.condition);
                out += '){';
                recurseList(node.body);
                out += ';}';
                break;
            }
            case 'elseClause': {
                out += 'else{';
                recurseList(node.body);
                out += ';}';
                break;
            }
            case 'whileStatement': {
                out += ';while(';
                recurse(node.condition);
                out += '){'
                recurseList(node.body);
                out += ';}';
                break;
            }
            case 'repeatStatement': {
                out += ';do{';
                recurseList(node.body);
                out += ';}while(!';
                recurse(node.condition);
                out += ');';
                break;
            }
            case 'localStatement': {
                out += ';auto ';
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable);
                    out += '=';
                    recurse(init);
                    if (i != length - 1) {
                        out += ',';
                    }
                }
                for (let i = length; i < node.variables.length; i++) {
                    // TODO
                }
                out += ';';
                break;
            }
            case 'globalStatement': {
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
                out += ';for(double ';
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
                out += ';}';
                break;
            }
            case 'forGenericStatement': {
                // TODO
                // out += ';for(const[';
                // if (node.keyVariable) {
                //     recurse(node.keyVariable);
                // }
                // out += ',';
                // recurse(node.valueVariable);
                // out += ']of Object.entries(';
                // recurse(node.objectVariable);
                // out += ')){';
                // recurseList(node.body);
                // out += '}';
                break;
            }
            case 'chunk': {
                recurseList(node.body);
                break;
            }
            case 'asyncStatement': {
                // TODO
                // out += ';(async()=>{';
                // recurseList(node.body);
                // out += '})();';
                break;
            }
            case 'identifier': {
                if (globals[node.name]) {
                    out += '_G_';
                }
                out += node.name;
                break;
            }
            case 'stringLiteral': {
                out += '\"';
                out += node.value;
                out += '\"';
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
                // TODO
                // out += '[';
                // recurse(node.key);
                // out += ']:';
                // recurse(node.value);
                break;
            }
            case 'arrayConstructorExpression': {
                // TODO
                // out += '[';
                // recurseList(node.list, true);
                // out += ']';
                break;
            }
            case 'tableConstructorExpression': {
                // TODO
                // out += '{';
                // recurseList(node.fields, true);
                // out += '}';
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
                out += '[](';
                for (let i = 0; i < node.parameters.length; i++) {
                    out += 'auto ';
                    recurse(node.parameters[i]);
                    if (i != node.parameters.length - 1) {
                        out += ',';
                    }
                }
                out += '){';
                recurseList(node.body);
                out += ';}'
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

    // out += '#include<bits/stdc++>\nusing namespace std;int main(){';
    out += '#include"./stdc++.h"\nusing namespace std;int main(){';

    // silvertip cpp runtime
    out += `// silvertip c++ runtime
auto print = [] (auto a) {
    cout << a << endl;
}
`

    recurse(ast);
    out += ';}';

    return out;
}



module.exports = tocpp;