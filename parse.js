/*
    parse.js

    convert tokens into an AST

    TODO:
    - decide on recursive (remove non-recursive stuff)
    - inconsitency: parseList vs parseToken
    - preserve whitespace (attach to token (beforeWhitespaceOrComments)?)
*/




const { error } = require("./utils");
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

    operationAssignment: function(variables, init) {
        return {
            type: 'OperationAssignment',
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

    forGenericStatement: function(variables, iterators, body) {
        return {
            type: 'ForGenericStatement',
            variables: variables,
            iterators: iterators,
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

    arrayEntry: function(value) {
        return {
            type: 'ArrayEntry',
            value: value
        };
    },

    tableEntry: function(key, value) {
        return {
            type: 'TableEntry',
            key: key,
            value: value
        };
    },
    
    arrayConstructorExpression: function(fields) {
        return {
            type: 'ArrayConstructorExpression',
            fields: fields
        };
    },
    tableConstructorExpression: function(fields) {
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
    indexExpression: function(base, index) {
        return {
            type: 'IndexExpression',
            base: base,
            index: index
        };
    },
    lambdaExpression: function(parameters, body) {
        return {
            type: 'LambdaExpression',
            parameters: parameters,
            body: body
        };
    },

    comment: function(value) {
        return {
            type: 'Comment',
            value: value,
        };
    },

    whitespace: function(value) {
        return {
            type: 'Whitespace',
            value: value,
        };
    }
};












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
    function parseListAny(list) {
        while (i < tokens.length) {
            let t = tokens[i];
            list.push(parseToken(t));
            if (!expect(i, 'symbol', ',')) {
                console.log(tokens[i]);
                break;
            }
            i++;
        }
    }

    // Parse assignment
    // var, ... = init, ...
    function parseAssignment(variables, init) {
        parseList(variables, 'identifier');

        let hasInit = expect(i, 'operator', '=');
        
        if (hasInit) {
            i++;

            parseListAny(init);
        }
    }

    function parseCondition() {
        let condition = parseToken(tokens[i]);
        return condition;
    }

    // Call when i position is set to arg starting parenthesis
    function parseFunction() {
        expectError(i, 'symbol', '(');
        i++;
        let args = [];
        if (!expect(i, 'symbol', ')')) {
            parseList(args, 'identifier');
            expectError(i, 'symbol', ')');
        }
        i++;

        let out = ast.lambdaExpression(args, []);

        let oldNode = node;
        node = out;
        parseBlock();
        node = oldNode;

        return out;
    }

    function parseExpression() {
        
    }

    // DEBUG
    let lastToken = null;

    function parseToken(token) {
        // DEBUG
        if (!lastToken || token.type != lastToken.type && token.value != lastToken.value) {
            printToken(token);
            lastToken = token;
        }



        switch (token.type) {
            case 'identifier': {
                i++;
                return ast.identifier(token.value);
                break;
            }
            case 'keyword': {
                switch (token.value) {
                    case 'local': {
                        i++;
                        if (expect(i, 'keyword', 'function')) {
                            i++; // Skip function keyword
                            let name = parseToken(tokens[i]);

                            let f = parseFunction();
                            
                            return ast.localStatement([name], [f]);
                        } else {
                            let variables = [];
                            let init = [];
                            parseAssignment(variables, init);
                            
                            return ast.localStatement(variables, init);
                        }
                        break;
                    }
                    case 'global': {
                        i++;
                        if (expect(i, 'keyword', 'function')) {
                            i++; // Skip function keyword
                            let name = parseToken(tokens[i]);

                            let f = parseFunction();
                            
                            return ast.localStatement([name], [f]);
                        } else {
                            let variables = [];
                            let init = [];
                            parseAssignment(variables, init);
                            
                            return ast.localStatement(variables, init);
                        }
                        break;
                    }
                    case 'function': {
                        i++; // Skip function keyword
                        let name = parseToken(tokens[i]);

                        let f = parseFunction();
                        
                        return ast.assignmentStatement([name], [f]);
                        break;
                    }
                    case 'return': {
                        i++;
                        let list = [];
                        parseListAny(list);

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

                            let condition = parseCondition();

                            node = ast.elseClause(condition, []);
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
                        i++;
                        return ast.literal('BooleanLiteral', true);
                        break;
                    }
                    case 'false': {
                        i++;
                        return ast.literal('BooleanLiteral', false);
                        break;
                    }
                    case 'null': {
                        i++;
                        return ast.literal('NullLiteral', null);
                        break;
                    }
                    default: {
                        error(`Invalid keyword '${value}'`);
                    }
                }
                break;
            }
            case 'symbol': {

                break;
            }
            case 'operator': {

                break;
            }
            case 'comment': {
                i++;
                return ast.comment(token.value);
                break;
            }
            case 'string': {
                i++;
                return ast.literal('StringLiteral', token.value);
                break;
            }
            case 'whitespace': {
                i++;
                return ast.whitespace(token.value);
                break;
            }
            case 'number': {
                i++;
                return ast.literal('NumericLiteral', parseFloat(token.value));
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