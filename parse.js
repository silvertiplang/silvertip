/*
    parse.js

    convert tokens into an AST

    TODO:
    - decide on recursive (remove non-recursive stuff)
    - inconsitency: parseList vs parseToken
    - preserve whitespace (attach to token (beforeWhitespaceOrComments)?)
    - parse expressions and operator prescedence
    - add eof token and attach before whitespace and comments
*/




const { error, makeMap } = require("./utils");
const { printToken } = require("./utils_debug");



// https://github.com/fstirlitz/luaparse/blob/0f525b152516bc8afa34564de2423b039aa83bc1/luaparse.js#L228
// Documentation and modifiable AST
let ast = {
    breakStatement: function() {
        return {
            type: 'BreakStatement'
        };
    },
    
    continueStatement: function() {
        return {
            type: 'ContinueStatement'
        };
    },

    returnStatement: function(args) {
        return {
            type: 'ReturnStatement',
            arguments: args
        }
    },

    ifStatement: function(clauses) {
        return {
            type: 'IfStatement',
            clauses: clauses
        };
    },
    ifClause: function(condition, body) {
        return {
            type: 'IfClause',
            condition: condition,
            body: body
        };
    },
    elseIfClause: function(condition, body) {
        return {
            type: 'ElseIfClause',
            condition: condition,
            body: body
        };
    },
    elseClause: function(body) {
        return {
            type: 'ElseClause',
            body: body
        };
    },

    whileStatement: function(condition, body) {
        return {
            type: 'WhileStatement',
            condition: condition,
            body: body
        };
    },

    repeatStatement: function(condition, body) {
        return {
            type: 'RepeatStatement',
            condition: condition,
            body: body
        };
    },

    localStatement: function(variables, init) {
        return {
            type: 'LocalStatement',
            variables: variables,
            init: init
        };
    },
    
    globalStatement: function(variables, init) {
        return {
            type: 'GlobalStatement',
            variables: variables,
            init: init
        };
    },

    assignmentStatement: function(variables, init) {
        return {
            type: 'AssignmentStatement',
            variables: variables,
            init: init
        };
    },

    operationAssignment: function(operation, variables, init) {
        return {
            type: 'OperationAssignment',
            operation: operation,
            variables: variables,
            init: init
        };
    },

    callStatement: function(base, args) {
        return {
            type: 'CallStatement',
            base: base,
            arguments: args
        };
    },

    // localFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'LocalFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    // globalFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'GlobalFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    // assignmentFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'AssignmentFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    forNumericStatement: function(variable, start, end, step, body) {
        return {
            type: 'ForNumericStatement',
            variable: variable,
            start: start,
            end: end,
            step: step,
            body: body
        };
    },

    forGenericStatement: function(objectVariable, valueVariable, keyVariable, body) {
        return {
            type: 'ForGenericStatement',
            objectVariable: objectVariable,
            valueVariable: valueVariable,
            keyVariable: keyVariable,
            body: body
        };
    },

    chunk: function(body) {
        return {
            type: 'Chunk',
            body: body
        };
    },

    asyncStatement: function(body) {
        return {
            type: 'AsyncStatement',
            body: body
        };
    },

    identifier: function(name) {
        return {
            type: 'Identifier',
            name: name
        };
    },

    literal: function(type, value) {
        // Type can be 'StringLiteral', 'NumericLiteral', 'BooleanLiteral', 'NullLiteral', 'VarargLiteral'
  
        return {
            type: type,
            value: value,
        };
    },

    arrayEntry: function(value) { // ATODO
        return {
            type: 'ArrayEntry',
            value: value
        };
    },

    tableEntry: function(key, value) { // ATODO
        return {
            type: 'TableEntry',
            key: key,
            value: value
        };
    },
    
    arrayConstructorExpression: function(fields) { // ATODO
        return {
            type: 'ArrayConstructorExpression',
            fields: fields
        };
    },
    tableConstructorExpression: function(fields) { // ATODO
        return {
            type: 'TableConstructorExpression',
            fields: fields
        };
    },
    binaryExpression: function(operator, left, right) {
        let type = ('&&' === operator || '||' === operator) ? 'LogicalExpression' : 'BinaryExpression';

        return {
            type: type,
            operator: operator,
            left: left,
            right: right
        };
    },
    unaryExpression: function(operator, argument) {
        return {
            type: 'UnaryExpression',
            operator: operator,
            argument: argument
        };
    },
    indexExpression: function(base, index) { // ATODO
        return {
            type: 'IndexExpression',
            base: base,
            index: index
        };
    },
    lambdaExpression: function(parameters, body) { // ATODO
        return {
            type: 'LambdaExpression',
            parameters: parameters,
            body: body
        };
    },

    comment: function(value) { // ATODO
        return {
            type: 'Comment',
            value: value,
        };
    },

    whitespace: function(value) { // ATODO
        return {
            type: 'Whitespace',
            value: value,
        };
    }
};





const text = {
    operator: makeMap(['+', '-', '*', '/', '%', '^', '==', '!=', '<', '<=', '>', '>=', '&&', '||', '!']),
    operationAssignment: makeMap(['+=', '-=', '*=', '/=', '%=', '^=', '&=', '|=']),
}




/*
AST: based off https://github.com/fstirlitz/luaparse
Nodes: 
{
    type: '
}
*/
function parse(tokens) {
    // Strip whitespace and comments (TODO preserve)
    let newTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token.type !== 'comment' && token.type !== 'whitespace') {
            newTokens.push(token);
        }
    }
    tokens = newTokens;


    // Parsing starts
    let out = ast.chunk([]); // Root of the tree
    let node = out; // Current node
    let nextNode = false;

    let i = 0;

    // function getNext(i) {
    //     if (i <= tokens.length - 1) {
    //         return tokens[i + 1];
    //     } else {
    //         return null;
    //     }
    // }

    // function consume(expectedType) {
    //     i++;
    //     let token = tokens[i];
    //     if (token.type != expectedType) {
    //         error(`Consume mismatch: Type '${expectedType}' expected, got '${token.type}'`)
    //     }
    //     return token;
    // }


    function expectError(i, type, value) {
        let token = tokens[i];
        if (!token) {
            error(`Expected token type '${type}', out of range`);
        }
        if (type && token.type != type) {
            error(`Expected token type '${type}', got '${token.type}'`);
        }
        if (value && token.value != value) {
            error(`Expected token value '${value}', got '${token.value}'`);
        }
    }

    function eofError(i, type, value) {
        if (i > tokens.length - 1) {
            error(`Expected token type '${type}', got EOF`);
        }
    }

    function expect(i, type, value) {
        let token = tokens[i];
        return !((!token) || (type && token.type != type) || (value && token.value != value));
    }

    // Parse comma list, with expecting identifier
    // type, ...
    function parseList(list, itemType) {
        while (i < tokens.length) {
            let t = tokens[i];
            if (t.type == itemType) {
                list.push(parseToken(t));
                if (!expect(i, 'symbol', ',')) {
                    break;
                }
                i++;
            } else {
                i++;
                break;
            }
        }
    }
    // Obsolete, since simple addition would trip this up
    // function parseListAny(list) {
    //     while (i < tokens.length) {
    //         let t = tokens[i];
    //         list.push(parseToken(t));
    //         if (!expect(i, 'symbol', ',')) {
    //             break;
    //         }
    //         i++;
    //     }
    // }
    function parseListExpression(list) {
        while (i < tokens.length) {
            list.push(parseExpression());
            if (!expect(i, 'symbol', ',')) {
                break;
            }
            i++;
        }
    }

    // Parse assignment
    // var, ... = init, ...
    let noAssignment = false;
    function parseAssignment(variables, init) {
        parseList(variables, 'identifier');

        let hasInit = expect(i, 'operator', '=');
        
        if (hasInit) {
            i++;

            parseListExpression(init);
        }
    }
    function parseOperationAssignment(variables, init) {
        // DOES NO CHECKING, USED IN OperationAssignment INTERNALLY
        parseList(variables, 'identifier');
        i++;
        parseListExpression(init);
    }

    function parseCondition() {
        let condition = parseToken(tokens[i]);
        return condition;
    }

    // Internally used for parsing args for functions and lambdas and function calls
    function parseArguments(list) {
        expectError(i, 'symbol', '(');
        i++;
        if (!expect(i, 'symbol', ')')) {
            parseList(list, 'identifier');
            expectError(i, 'symbol', ')');
        }
        i++;
    }

    // Same as arguments except parseListExpression
    function parseCallArguments(list) {
        expectError(i, 'symbol', '(');
        i++;
        if (!expect(i, 'symbol', ')')) {
            parseListExpression(list);
            expectError(i, 'symbol', ')');
        }
        i++;
    }

    // Call when i position is set to arg starting parenthesis
    let noCall = false;
    function parseFunction() {
        let args = [];
        parseArguments(args);

        let out = ast.lambdaExpression(args, []);

        let oldNode = node;
        node = out;
        parseBlock();
        node = oldNode;

        return out;
    }

    let noArrow = false;
    function parseLambda() {
        let hasParenthesis = expect(i, 'symbol', '(');
        let list = [];
        noArrow = true;
        if (hasParenthesis) {
            i++;
            if (!expect(i, 'symbol', ')')) {
                parseList(list, 'identifier');
                expectError(i, 'symbol', ')');
            }
            i++;
        } else {
            parseList(list, 'identifier');
        }
        noArrow = false;

        expectError(i, 'operator', '->');
        i++;

        let out = ast.lambdaExpression(list, []);

        if (expect(i, 'symbol', '{')) {
            let oldNode = node;
            node = out;
            parseBlock();
            node = oldNode;
        } else {
            out.body.push(ast.returnStatement(parseExpression()));
        }

        return out;
    }

    let noExpression = false;
    // Usually, don't pass in anything, just call it with no args, but when you are evaluating an expression that started with an opening parenthesis, pass in nested so that it can break out when it sees closing parenthesis
    function parseExpression(nested) {
        let current = null;

        if (expect(i, 'symbol', '(')) {
            let oldI = i;
            i++;

            let isLambda = true;


            let list = [];
            if (!expect(i, 'symbol', ')')) {
                parseList(list, 'identifier');
                if (!expect(i, 'symbol', ')')) {
                    isLambda = false;
                }
            }
            i++;
            if (!expect(i, 'operator', '->')) {
                isLambda = false;
            }
            // i++;
            // if (!expect(i, 'symbol', '{')) {
            //     isLambda = false;
            // }

            if (isLambda) {
                i = oldI;
                current = parseLambda();
            } else {
                i = oldI;
                i++;
                current = parseExpression(true);
            }
        } else {
            noExpression = true;
            current = parseToken(tokens[i]);
            noExpression = false;
        }

        while (i < tokens.length) {
            if (nested && expect(i, 'symbol', ')')) {
                i++;
                break;
            }

            let token = tokens[i];
            if (!token) {
                break;
            }
            let operator = token.value;
            if (text.operator[operator]) {
                i++;
                noExpression = true;
                rhs = parseToken(tokens[i]);
                noExpression = false;
                current = ast.binaryExpression(operator, current, rhs);
            } else {
                break;
            }
        }
        
        return current;
    }

    // let noList = false
    function getAfterList(listType) {
        // if (noList) {
        //     return -1;
        // }

        let oldI = i;
        // let list = [];

        // noList = true;
        // parseList(list, listType);
        // Custom list parsing function
        while (i < tokens.length) {
            let t = tokens[i];
            if (t.type == listType) {
                // list.push(parseToken(t));
                i++;
                if (!expect(i, 'symbol', ',')) {
                    break;
                }
                i++;
            } else {
                i++;
                break;
            }
        }
        // noList = false;


        let i2 = i;
        i = oldI;
        return i2;
    }


    // DEBUG
    // let lastToken = null;

    function parseToken(token) {
        // DEBUG
        // if (!lastToken || token.type != lastToken.type && token.value != lastToken.value) {
            printToken(token);
            lastToken = token;
        // }



        switch (token.type) {
            case 'identifier': {
                let expectAfterListI = getAfterList('identifier');
                console.log(tokens[expectAfterListI]);
                i++;
                if (!noCall && expect(i, 'symbol', '(')) {
                    let out = ast.callStatement(ast.identifier(token.value), []);
                    parseCallArguments(out.arguments);
                    return out;
                } else if (!noArrow && expect(i, 'operator', '->')) {
                    let oldI = i;

                    // forgeneric or lambda or (pipe but irrelevant)
                    // (pipe will be absorbed before it reaches here, and it will be skipped in here)
                    i++;
                    if (expect(i, 'identifier')) {
                        let oldI2 = i;
                        i = oldI - 1;
                        noArrow = true;
                        let objectVariable = parseToken(tokens[i]);
                        noArrow = false;
                        i = oldI2;

                        let v = [];
                        parseList(v, 'identifier');
                        let valueVariable, keyVariable;
                        if (v.length == 1) {
                            valueVariable = v[0];
                            keyVariable = null;
                        } else {
                            valueVariable = v[0];
                            keyVariable = v[1];
                        }

                        let out = ast.forGenericStatement(objectVariable, valueVariable, keyVariable, []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        return out;
                    } else if (expect(i, 'symbol', '{')) {
                        i = i - 2;
                        return parseLambda();
                    } else {
                        // Pipe

                        // disregard, it will be processed later (since anything can be piped in)

                        // error(`Invalid token '${token.value}' after '->'`);
                    }
                } else if (!noArrow && expect(expectAfterListI, 'operator', '->')) {
                    // lambda or pipe
                    if (expect(expectAfterListI + 1, 'symbol', '{')) {
                        i--;
                        return parseLambda();
                    } else {
                        // Pipe

                        // disregard, it will be processed later (since anything can be piped in)

                    }
                } else if (!noAssignment && expect(expectAfterListI, 'operator', '=')) {
                    let oldI = i;
                    i = expectAfterListI + 1;
                    let forStart = parseExpression();
                    let isFor = expect(i, 'operator', '->');

                    if (isFor) {
                        i++;
                        let forEnd = parseExpression();

                        // DIRTY, OPTIMIZE
                        let oldI2 = i;
                        i = oldI - 1;
                        noAssignment = true;
                        let forVariable = parseToken(tokens[i]);
                        noAssignment = false;
                        i = oldI2;

                        // TODO
                        let forStep = ast.literal('NumericLiteral', 1);

                        let out = ast.forNumericStatement(forVariable, forStart, forEnd, forStep, []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        return out;
                    } else {
                        i = oldI;
                        i--;
                        let variables = [];
                        let init = [];
                        noAssignment = true;
                        parseAssignment(variables, init);
                        noAssignment = false;
                        return ast.assignmentStatement(variables, init);
                    }
                    
                } else if (!noAssignment && expect(expectAfterListI, 'operator') && text.operationAssignment[tokens[expectAfterListI].value]) {
                    let operation = tokens[expectAfterListI].value.substring(0, 1);
                    i--;
                    let variables = [];
                    let init = [];
                    noAssignment = true;
                    parseOperationAssignment(variables, init);
                    noAssignment = false;
                    
                    return ast.operationAssignment(operation, variables, init);
                } else {
                    return ast.identifier(token.value);
                }
                break;
            }
            case 'keyword': {
                switch (token.value) {
                    case 'local': {
                        i++;
                        if (expect(i, 'keyword', 'function')) {
                            i++; // Skip function keyword

                            noCall = true;
                            let name = parseToken(tokens[i]);
                            noCall = false;

                            let f = parseFunction();
                            
                            return ast.localStatement([name], [f]);
                        } else {
                            let variables = [];
                            let init = [];
                            noAssignment = true;
                            parseAssignment(variables, init);
                            noAssignment = false;
                            
                            return ast.localStatement(variables, init);
                        }
                        break;
                    }
                    case 'global': {
                        i++;
                        if (expect(i, 'keyword', 'function')) {
                            i++; // Skip function keyword

                            noCall = true;
                            let name = parseToken(tokens[i]);
                            noCall = false;

                            let f = parseFunction();
                            
                            return ast.localStatement([name], [f]);
                        } else {
                            let variables = [];
                            let init = [];
                            noAssignment = true;
                            parseAssignment(variables, init);
                            noAssignment = false;
                            
                            return ast.localStatement(variables, init);
                        }
                        break;
                    }
                    case 'function': {
                        i++; // Skip function keyword

                        noCall = true;
                        let name = parseToken(tokens[i]);
                        noCall = false;

                        let f = parseFunction();
                        
                        return ast.assignmentStatement([name], [f]);
                        break;
                    }
                    case 'return': {
                        i++;
                        let list = [];
                        parseListExpression(list);

                        return ast.returnStatement(list);
                        break;
                    }
                    case 'while': {
                        i++;

                        let condition = parseCondition();

                        let out = ast.whileStatement(condition, []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        return out;
                        break;
                    }
                    case 'until': {
                        error(`Unexpected 'until' modifier`);
                        break;
                    }
                    case 'repeat': {
                        i++;

                        let out = ast.repeatStatement(ast.literal('BooleanLiteral', false), []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        if (expect(i, 'keyword', 'until')) {
                            i++;
                            out.condition = parseCondition();
                        }

                        return out;
                        break;
                    }
                    case 'break': {
                        i++;
                        return ast.breakStatement();
                        break;
                    }
                    case 'continue': {
                        i++;
                        return ast.continueStatement();
                        break;
                    }
                    case 'if': {
                        i++;

                        let condition = parseCondition();

                        let oldNode = node;

                        node = ast.ifClause(condition, []);
                        let out = ast.ifStatement([node]);
                        parseBlock();

                        while (expect(i, 'keyword', 'elseif')) {
                            i++;

                            let condition = parseCondition();

                            node = ast.elseIfClause(condition, []);
                            out.clauses.push(node);
                            parseBlock();
                        }

                        if (expect(i, 'keyword', 'else')) {
                            i++;

                            node = ast.elseClause([]);
                            out.clauses.push(node);
                            parseBlock();
                        }

                        node = oldNode;

                        return out;
                        break;
                    }
                    case 'elseif': {
                        error(`Unexpected 'elseif' clause`);
                        break;
                    }
                    case 'else': {
                        error(`Unexpected 'else' clause`);
                        break;
                    }
                    case 'async': {
                        i++;
                        
                        let out = ast.asyncStatement([]);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        return out;
                        break;
                    }
                    case 'true': {
                        if (noExpression) {
                            i++;
                            return ast.literal('BooleanLiteral', true);
                        } else {
                            return parseExpression();
                        }
                        break;
                    }
                    case 'false': {
                        if (noExpression) {
                            i++;
                            return ast.literal('BooleanLiteral', false);
                        } else {
                            return parseExpression();
                        }
                        break;
                    }
                    case 'null': {
                        if (noExpression) {
                            i++;
                            return ast.literal('NullLiteral', null);
                        } else {
                            return parseExpression();
                        }
                        break;
                    }
                    default: {
                        error(`Invalid keyword '${value}'`);
                    }
                }
                break;
            }
            case 'symbol': {
                error(`Unexpected symbol '${token.value}'`);
                break;
            }
            case 'operator': {
                if (token.value == '-') {
                    i++;
                    return ast.unaryExpression('-', parseExpression());
                } else if (token.value == '->') {
                    // TODO
                } else {
                    error(`Unexpected operator '${token.value}'`);
                }
                break;
            }
            case 'comment': {
                i++;
                return ast.comment(token.value);
                break;
            }
            case 'string': {
                if (noExpression) {
                    i++;
                    return ast.literal('StringLiteral', token.value);
                } else {
                    return parseExpression();
                }
                break;
            }
            case 'whitespace': {
                i++;
                return ast.whitespace(token.value);
                break;
            }
            case 'number': {
                if (noExpression) {
                    i++;
                    return ast.literal('NumericLiteral', parseFloat(token.value));
                } else {
                    return parseExpression();
                }
                break;
            }
            default: {
                error(`Invalid token type '${token.type}'`);
            }
        }
    }

    function parseBlock() {
        expectError(i, 'symbol', '{');
        i++;
        while (i < tokens.length) {
            if (expect(i, 'symbol', '}')) {
                i++;
                return;
            }

            let token = tokens[i];
            node.body.push(parseToken(token));
            if (nextNode) {
                node = nextNode;
                nextNode = false;
            }
        }
        eofError(i, 'symbol', '}');
    }

    while (i < tokens.length) {
        let token = tokens[i];
        node.body.push(parseToken(token));
        if (nextNode) {
            node = nextNode;
            nextNode = false;
        }
    }

    return out;
}


module.exports = parse;