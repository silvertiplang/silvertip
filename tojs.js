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

    // recurse assignment with a call statement in its init
    function recurseAssignmentCall(node) {
        out += '[';
        recurseList(node.variables);
        out += ']=[';
        for (let i = 0; i < node.init.length; i++) {
            let v = node.init[i];
            if (typeMap[v.type] == 'callStatement') {
                out += '...';
            }
            recurse(v);
            if (i != node.init.length - 1) {
                out += ',';
            }
        }
        out += ']';
    }
    function checkFor(nodeList, type) {
        for (let i = 0; i < nodeList.length; i++) {
            if (typeMap[nodeList[i].type] == type) {
                return true;
            }
        }
        return false;
    }
    function recurseAssignmentOptionalInit(node) {
        if (checkFor(node.init, 'callStatement')) {
            recurseAssignmentCall(node);
        } else {
            out += ' ';
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
        }
    }
    function recurseAssignmentCallRequiredInit(node) {
        if (checkFor(node.init, 'callStatement')) {
            recurseAssignmentCall(node);
        } else {
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
        }
    }

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
                out += 'return[';
                recurseList(node.arguments);
                out += ']';
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
                out += 'let';
                recurseAssignmentOptionalInit(node);
                break;
            }
            case 'globalStatement': {
                out += 'global';
                recurseAssignmentOptionalInit(node);
                break;
            }
            case 'assignmentStatement': {
                recurseAssignmentCallRequiredInit(node);
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
                let parentType = typeMap[node.parent.type];

                // console.log(parentType);
                // TODO: ASSESS NEED FOR PARENTHESIS AROUND WHOLE EXPRESSION
                if (parentType == 'returnStatement' || parentType == 'arrayConstructorExpression' || parentType == 'callStatement') {
                    out += '...';
                }

                recurse(node.base);
                out += '(';
                recurseList(node.arguments);
                out += ')';

                if (parentType == 'logicalExpression' || parentType == 'binaryExpression' || parentType == 'unaryExpression' || parentType == 'tableEntry' || parentType == 'indexExpression') {
                    out += '[0]';
                }

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
                recurseBody(node.body);
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