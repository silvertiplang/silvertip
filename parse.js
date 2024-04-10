/*
    parse.js

    convert tokens into an AST

    TODO:
    - decide on recursive (remove non-recursive stuff)
    - inconsitency: parseList vs parseToken
    - preserve whitespace (attach to token (beforeWhitespaceOrComments)?)
    - parse expressions and operator prescedence
    - add eof token and attach before whitespace and comments
    - change '|=' -> '||=' and '&=' -> '&&='
*/




const ast = require("./ast");
const { error, makeMap, assignParents } = require("./utils");
const { printToken } = require("./utils_debug");





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

    let noListExpression = false;
    function parseListExpression(list) {
        noListExpression = true;
        while (i < tokens.length) {
            list.push(parseExpression());
            if (!expect(i, 'symbol', ',')) {
                break;
            }
            i++;
        }
        noListExpression = false;
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

    // function parseCondition() {
    //     let condition = parseExpression();
    //     return condition;
    // }

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
            out.body.push(ast.returnStatement([parseExpression()]));
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

                if ('&&' === operator || '||' === operator) {
                    current = ast.logicalExpression(operator, current, rhs);
                } else {
                    current = ast.binaryExpression(operator, current, rhs);
                }
            } else {
                break;
            }
        }

        
        // indexing at the end
        while (true) {
            if (expect(i, 'symbol', '.') && expect(i + 1, 'identifier')) {
                i++;
                let rhs = tokens[i];
                current = ast.indexExpression(current, ast.stringLiteral(rhs.value));
                i++;
            } else if (expect(i, 'symbol', '[')) {
                i++;
                let v = noIdentifier;
                noIdentifier = false;
                let rhs = parseExpression();
                noIdentifier = v;
                expectError(i, 'symbol', ']');
                current = ast.indexExpression(current, rhs);
                i++;
            } else {
                break;
            }
        }
        
        return current;
    }

    function getAfterList(listType) {
        let oldI = i;
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

        let i2 = i;
        i = oldI;
        return i2;
    }
    function getAfterListExpression() {
        let oldI = i;
        // Custom list parsing function
        while (i < tokens.length) {
            parseExpression();
            if (!expect(i, 'symbol', ',')) {
                break;
            }
            i++;
        }

        let i2 = i;
        i = oldI;
        return i2;
    }

    let noPipe = false;
    function parsePipe(first) {
        noPipe = true;
        noArrow = true;

        // Initial expectation
        expectError(i, 'operator', '->');

        let current = first;
        let iN = 0;
        let finalModifier = null;

        while (true) {
            i++;

            // final modifier
            if (expect(i, 'keyword')) {
                finalModifier = tokens[i].value;
                i++;
            }

            let oldI = i;

            let expr = parseExpression();

            // if (!initial) {
            //     current = [current];
            //     initial = false;
            // }

            if (expect(i, 'operator', '->')) {
                // function (or something that is a function)
                if (finalModifier != null) {
                    error('Final modifier came before last')
                }
                current = ast.callStatement(expr, current);
            } else {
                // reparse expression (since it is a list)
                let expr2 = [];
                i = oldI;
                parseList(expr2, 'identifier');

                // final variable
                if (iN != 0) {
                    current = [current];
                }
                if (finalModifier == null) {
                    current = ast.assignmentStatement(expr2, current);
                } else if (finalModifier == 'local') {
                    current = ast.localStatement(expr2, current);
                } else if (finalModifier == 'global') {
                    current = ast.globalStatement(expr2, current);
                } else {
                    error('Unknown final modifier');
                }
                break;
            }

            iN++;
        }

        noPipe = false;
        noArrow = false;

        // console.log(current);
        return current;
    }

    function parseExpressionOrPipe() {
        if (noListExpression) {
            return parseExpression();
        } else {
            let list = [];
            parseListExpression(list);

            if (!noPipe && expect(i, 'operator', '->')) {
                // Pipe
                return parsePipe(list);
            } else {
                if (list > 1) {
                    error(`Unexpected symbol ','`);
                }
                return list[0];
            }
        }
    }


    let noIdentifier = false;
    let noExtendedIdentifier = false;
    function parseExtendedIdentifier() {
        noExtendedIdentifier = true;
        // call when i is on the first identifier in the chain
        let current = ast.identifier(tokens[i].value);
        i++;
        while (true) {
            if (expect(i, 'symbol', '.') && expect(i + 1, 'identifier')) {
                i++;
                let rhs = tokens[i];
                current = ast.indexExpression(current, ast.stringLiteral(rhs.value));
                i++;
            } else if (expect(i, 'symbol', '[')) {
                i++;
                let v = noIdentifier;
                noIdentifier = false;
                let rhs = parseExpression();
                noIdentifier = v;
                expectError(i, 'symbol', ']');
                current = ast.indexExpression(current, rhs);
                i++;
            } else {
                break;
            }
        }
        noExtendedIdentifier = false;
        return current;
    }

    let noListExtendedIdentifier = false;
    function parseListExtendedIdentifier(list) {
        /*
        terminology:
        - identifier: variable name
        - extended identifier: variable name + possible index (varname.a['a'].b)
        */
        noListExtendedIdentifier = true;
        while (i < tokens.length) {
            list.push(parseExtendedIdentifier());
            if (!expect(i, 'symbol', ',')) {
                break;
            }
            i++;
        }
        noListExtendedIdentifier = false;
    }
    function getAfterListExtendedIdentifier() {
        let oldI = i;

        noListExtendedIdentifier = true;
        while (i < tokens.length) {
            parseExtendedIdentifier();
            if (!expect(i, 'symbol', ',')) {
                break;
            }
            i++;
        }
        noListExtendedIdentifier = false;

        let i2 = i;
        i = oldI;
        return i2;
    }




    // DEBUG
    // let lastToken = null;

    function parseToken(token, isStatement) {
        // DEBUG
        // if (!lastToken || token.type != lastToken.type && token.value != lastToken.value) {
            // printToken(token);
            // lastToken = token;
        // }



        switch (token.type) {
            case 'identifier': {
                if (noIdentifier) {
                    return parseExtendedIdentifier();
                }

                // v2
                let originalI = i;
                let extendedIdentifiers = [];
                noIdentifier = true;
                parseListExtendedIdentifier(extendedIdentifiers);
                noIdentifier = false;
                let extendedIdentifiersI = i;

                i = originalI;
                let identifiers = [];
                noIdentifier = true;
                parseList(identifiers, 'identifier');
                noIdentifier = false;
                let identifiersI = i;

                i = originalI;
                let identifier = parseExtendedIdentifier();

                let length = identifiers.length;
                let containsOnlyIdentifier = identifiersI == extendedIdentifiersI;
                
                if (!noCall && length == 1 && expect(extendedIdentifiersI, 'symbol', '(')) {
                    if (noExpression) {
                        i = extendedIdentifiersI;
                        let out = ast.callStatement(extendedIdentifiers[0], []);
                        parseCallArguments(out.arguments);
                        return out;
                    } else {
                        i = originalI;
                        return parseExpressionOrPipe();
                    }
                // TODO: ADD EXTENDED IDENTIFIER HERE?
                // } else if (!noExtendedIdentifier && length == 1 && expect(identifiersI, 'symbol', '[')) {
                //     i = identifiersI;
                //     return parseExtendedIdentifier();
                } else if (!noArrow && (expect(identifiersI, 'operator', '->') || expect(extendedIdentifiersI, 'operator', '->'))) {
                    i++;
                    // forgeneric or lambda or (pipe but irrelevant)
                    // (pipe will be absorbed before it reaches here, and it will be skipped in here)
                    if (identifiers.length == 1 && expect(i, 'identifier') && expect(getAfterList('identifier'), 'symbol', '{')) {
                        i = originalI;
                        noArrow = true;
                        let objectVariable = parseToken(tokens[i]);
                        noArrow = false;
                        i++;

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
                    // } else if (expect(extendedIdentifiersI + 1, 'symbol', '{')) {
                    } else if (!isStatement) {
                        i = originalI;
                        return parseLambda();
                    } else {
                        // Pipe

                        // NEVERMIND IT WON'T BE PROCESSED LATER
                        i--;
                        // console.log(tokens[i - 1])
                        // console.log(extendedIdentifiers, tokens[i])
                        return parsePipe(extendedIdentifiers);



                        // disregard, it will be processed later (since anything can be piped in)

                        // error(`Invalid token '${token.value}' after '->'`);
                    }



                } else if (!noAssignment && expect(extendedIdentifiersI, 'operator', '=')) {
                    i = extendedIdentifiersI + 1;
                    let forStart = parseExpression();
                    let isFor = expect(i, 'operator', '->');

                    if (isFor) {
                        i++;
                        let forEnd = parseExpression();

                        let forVariable = identifier;

                        // TODO
                        let forStep = ast.numericLiteral(1);

                        let out = ast.forNumericStatement(forVariable, forStart, forEnd, forStep, []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        return out;
                    } else {
                        let init = [];
                        i = extendedIdentifiersI + 1;
                        parseListExpression(init);
                        return ast.assignmentStatement(extendedIdentifiers, init);
                    }
                    
                } else if (!noAssignment && expect(extendedIdentifiersI, 'operator') && text.operationAssignment[tokens[extendedIdentifiersI].value]) {
                    let op = tokens[extendedIdentifiersI].value;
                    let operation = op.substring(0, op.length - 1);
                    let init = [];
                    i = extendedIdentifiersI + 1;
                    parseListExpression(init);
                    return ast.operationAssignment(operation, extendedIdentifiers, init);
                } else {
                    return identifier;
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
                            
                            return ast.globalStatement([name], [f]);
                        } else {
                            let variables = [];
                            let init = [];
                            noAssignment = true;
                            parseAssignment(variables, init);
                            noAssignment = false;
                            
                            return ast.globalStatement(variables, init);
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

                        let condition = parseExpression();

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

                        let out = ast.repeatStatement(ast.booleanLiteral(false), []);

                        let oldNode = node;
                        node = out;
                        parseBlock();
                        node = oldNode;

                        if (expect(i, 'keyword', 'until')) {
                            i++;
                            out.condition = parseExpression();
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

                        let condition = parseExpression();

                        let oldNode = node;

                        node = ast.ifClause(condition, []);
                        let out = ast.ifStatement([node]);
                        parseBlock();

                        while (expect(i, 'keyword', 'elseif')) {
                            i++;

                            let condition = parseExpression();

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
                            return ast.booleanLiteral(true);
                        } else {
                            return parseExpressionOrPipe();
                        }
                        break;
                    }
                    case 'false': {
                        if (noExpression) {
                            i++;
                            return ast.booleanLiteral(false);
                        } else {
                            return parseExpressionOrPipe();
                        }
                        break;
                    }
                    case 'null': {
                        if (noExpression) {
                            i++;
                            return ast.nullLiteral(null);
                        } else {
                            return parseExpressionOrPipe();
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
                if (token.value == '[') {
                    if (noExpression) {
                        i++;
                        let list = [];
                        if (!expect(i, 'symbol', ']')) {
                            parseListExpression(list);
                            expectError(i, 'symbol', ']');
                        }
                        i++;
                        return ast.arrayConstructorExpression(list);
                    } else {
                        return parseExpressionOrPipe();
                    }
                } else if (token.value == '{') {
                    if (noExpression) {
                        i++;
                        let list = [];
                        if (!expect(i, 'symbol', '}')) {
                            while (true) {
                                let key;
                                if (expect(i, 'symbol', '[')) {
                                    i++;
                                    key = parseExpression();
                                    expectError(i, 'symbol', ']');
                                } else {
                                    expectError(i, 'identifier');
                                    key = ast.stringLiteral(tokens[i].value);
                                }
                                i++;
                                expectError(i, 'symbol', ':');
                                i++;
                                let value = parseExpression();
                                list.push(ast.tableEntry(key, value));
                                if (expect(i, 'symbol', ',')) {
                                    i++;
                                } else {
                                    expectError(i, 'symbol', '}');
                                    break;
                                }
                            }
                        }
                        i++;
                        return ast.tableConstructorExpression(list);
                    } else {
                        return parseExpressionOrPipe();
                    }
                } else {
                    error(`Unexpected symbol '${token.value}'`);
                }
                break;
            }
            case 'operator': {
                if (token.value == '-') {
                    i++;
                    return ast.unaryExpression('-', parseExpression());
                // } else if (token.value == '->') {
                //     // TODO
                //     // Forced to backtrack (NVM DONT BACKTRACK)
                //     // let expectBeforeListI = getAfterList('identifier');
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
                    return ast.stringLiteral(token.value);
                } else {
                    return parseExpressionOrPipe();
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
                    return ast.numericLiteral(parseFloat(token.value));
                } else {
                    return parseExpressionOrPipe();



                    // v2

                    // if (noListExpression) {
                    //     return parseExpression();
                    // } else {
                    //     let list = [];
                    //     parseListExpression(list);

                    //     if (!noPipe && expect(i, 'operator', '->')) {
                    //         // Pipe
                    //         return parsePipe(list);
                    //     } else {
                    //         if (list > 1) {
                    //             error(`Unexpected symbol ','`);
                    //         }
                    //         return list[0];
                    //     }
                    // }



                    // v1

                    // let out = parseExpression();

                    // if (!noPipe && expect(i, 'operator', '->')) {
                    //     // Pipe
                    //     return parsePipe(out);
                    // } else {
                    //     return out;
                    // }
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
            node.body.push(parseToken(token, true));
            if (nextNode) {
                node = nextNode;
                nextNode = false;
            }
        }
        eofError(i, 'symbol', '}');
    }

    while (i < tokens.length) {
        let token = tokens[i];
        node.body.push(parseToken(token, true));
        if (nextNode) {
            node = nextNode;
            nextNode = false;
        }
    }

    assignParents(out);

    return out;
}


module.exports = parse;