/*
    astcheck.js

    check the ast to see if it is syntactically valid
*/

const ast = require("./ast");
const { error, generateASTDecode } = require("./utils");
let typeMap = generateASTDecode(ast);



const expectExpression = {
    callStatement: true,
    identifier: true,
    stringLiteral: true,
    numericLiteral: true,
    booleanLiteral: true,
    nullLiteral: true,
    arrayConstructorExpression: true,
    tableConstructorExpression: true,
    logicalExpression: true,
    binaryExpression: true,
    unaryExpression: true,
    lambdaExpression: true,
};

const expectStatement = {
    breakStatement: true,
    continueStatement: true,
    returnStatement: true,
    ifStatement: true,
    whileStatement: true,
    repeatStatement: true,
    localStatement: true,
    globalStatement: true,
    assignmentStatement: true,
    operationAssignment: true,
    callStatement: true,
    forNumericStatement: true,
    forGenericStatement: true,
    chunk: true,
    asyncStatement: true,
};

const expectIfClause = {
    ifClause: true,
    elseIfClause: true,
    elseClause: true,
};



function astcheck(ast) {
    // traverse ast and output
    function recurse(node, expect) {
        let type = typeMap[node.type];
        let ok;
        if (typeof expect == 'object') {
            ok = expect[type];
        } else {
            if (ok == expect) {
                ok = true;
            }
        }
        if (expect && !ok) {
            if (typeof expect == 'object') {
                let expectt = [];
                for (const [k, v] of Object.entries(expect)) {
                    expectt.push(k);
                }
                error(`Expected node type '${expectt.join(', ')}', got '${type}'`);
            } else {
                error(`Expected node type '${expect}', got '${type}'`);
            }
        }


        switch (type) {
            case 'breakStatement': {
                break;
            }
            case 'continueStatement': {
                break;
            }
            case 'returnStatement': {
                recurseList(node.arguments, expectExpression);
                break;
            }
            case 'ifStatement': {
                recurseList(node.clauses, expectIfClause);
                break;
            }
            case 'ifClause': {
                recurse(node.condition, expectExpression);
                recurseList(node.body, expectStatement);
                break;
            }
            case 'elseIfClause': {
                recurse(node.condition, expectExpression);
                recurseList(node.body, expectStatement);
                break;
            }
            case 'elseClause': {
                recurseList(node.body, expectStatement);
                break;
            }
            case 'whileStatement': {
                recurse(node.condition, expectExpression);
                recurseList(node.body, expectStatement);
                break;
            }
            case 'repeatStatement': {
                recurseList(node.body, expectStatement);
                recurse(node.condition, expectExpression);
                break;
            }
            case 'localStatement': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    if (init) {
                        recurse(variable, 'identifier');
                        recurse(init, expectExpression);
                    } else {
                        recurse(variable, 'identifier');
                    }
                }
                break;
            }
            case 'globalStatement': {
                for (let i = 0; i < node.variables.length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    if (init) {
                        recurse(variable, 'identifier');
                        recurse(init, expectExpression);
                    } else {
                        recurse(variable, 'identifier');
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable, 'identifier');
                    recurse(init, expectExpression);
                }
                break;
            }
            case 'operationAssignment': {
                let length = node.variables.length < node.init.length ? node.variables.length : node.init.length;
                for (let i = 0; i < length; i++) {
                    let variable = node.variables[i];
                    let init = node.init[i];
                    recurse(variable, 'identifier');
                    recurse(init, expectExpression);
                }
                break;
            }
            case 'callStatement': {
                recurse(node.base, expectExpression);
                recurseList(node.arguments, expectExpression);
                break;
            }
            case 'forNumericStatement': {
                recurse(node.variable, 'identifier');
                recurse(node.start, expectExpression);
                recurse(node.end, expectExpression);
                recurse(node.step, expectExpression);
                recurseList(node.body, expectStatement);
                break;
            }
            case 'forGenericStatement': {
                if (node.keyVariable) {
                    recurse(node.keyVariable, 'identifier');
                }
                recurse(node.valueVariable, 'identifier');
                recurse(node.objectVariable, 'identifier');
                recurseList(node.body, expectStatement);
                break;
            }
            case 'chunk': {
                recurseList(node.body, expectStatement);
                break;
            }
            case 'asyncStatement': {
                recurseList(node.body, expectStatement);
                break;
            }
            case 'identifier': {
                break;
            }
            case 'stringLiteral': {
                break;
            }
            case 'numericLiteral': {
                break;
            }
            case 'booleanLiteral': {
                break;
            }
            case 'nullLiteral': {
                break;
            }
            case 'varargLiteral': {
                // ATODO
                break;
            }
            case 'tableEntry': {
                recurse(node.key, expectExpression);
                recurse(node.value, expectExpression);
                break;
            }
            case 'arrayConstructorExpression': {
                recurseList(node.list, expectExpression);
                break;
            }
            case 'tableConstructorExpression': {
                recurseList(node.fields, 'tableEntry');
                break;
            }
            case 'logicalExpression': {
                recurse(node.left, expectExpression);
                recurse(node.right, expectExpression);
                break;
            }
            case 'binaryExpression': {
                recurse(node.left, expectExpression);
                recurse(node.right, expectExpression);
                break;
            }
            case 'unaryExpression': {
                recurse(node.argument, expectExpression);
                break;
            }
            case 'indexExpression': {
                recurse(node.base, expectExpression);
                recurse(node.index, expectExpression);
                break;
            }
            case 'lambdaExpression': {
                recurseList(node.parameters, 'identifier');
                recurseList(node.body, expectStatement);
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
    function recurseList(list, expect) {
        for (let i = 0; i < list.length; i++) {
            recurse(list[i], expect);
        }
    }

    recurse(ast);
}


module.exports = astcheck;