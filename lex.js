/*
    lex.js

    convert source code into tokens
*/




const { error } = require("./utils");




/*
makeMap: Make a map from the values of an array
array: array of values
return: map where you can index it with the value and it will return true
*/
function makeMap(array) {
    let map = {};
    for (let i = 0; i < array.length; i++) {
        map[array[i]] = true;
    }
    return map;
}

// text maps of each token
const text = {
    identifier1: makeMap(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']),
    identifier2: makeMap(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
    symbol: makeMap(['/', '*', '(', ')', '-', '>', '.', '{', '}', ',', ':', '[', ']', '=', '+', '%', '^', '!', '<', '&', '|']),
    shortString: makeMap(['\'', '"']),
    shortStringEscape: makeMap(['\\']),
    longString: makeMap(['`']),
    whitespace: makeMap([' ', '\t', '\n', '\r']),
    number1: makeMap(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']),
    number2: makeMap(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'e']),

    
    operator: makeMap(['+', '-', '*', '/', '%', '^', '==', '!=', '<', '<=', '>', '>=', '&&', '||', '!',
    // not operators but punctuator
    '=', '->', '<-']),
    comment: {
        start: '/*',
        // end: '*/', // TODO: Unhardcode
    },
    keyword: makeMap(['local', 'global', 'function', 'return', 'while', 'until', 'repeat', 'break', 'continue', 'if', 'elseif', 'else', 'async', 'true', 'false', 'null']),

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#escape_sequences
    escape: {
        ['\\']: '\\',
        t: '\t',
        v: '\v',
        f: '\f',
        n: '\n',
        r: '\r'
    },
};


/*
there are 2 approaches: finite state machine and scanner
we're using fsm, but i felt like scanner would be better...
*/
function lex(src) {
    let state = {
        in: false, // false, 'identifier', 'symbol', 'comment', 'whitespace', 'number', 'shortString', 'longString'
        stringStart: '', // Starting character of string, ex: '
        current: '', // Current value of next token
        escape: false, // Escape next character of string?

        // flags
        skipstatecheck: false, // Triggered when string ends, to prevent another string from beginning
    }

    /*
    tokens = [
        {
            type: (identifier, keyword, symbol, operator, comment, string, whitespace, number),
            value: '...',
        },
        ...
    ]
    */
    let tokens = [];
    // One extra loop so that last token can be pushed
    for (let i = 0; i < src.length + 1; i++) {
        // console.log(i, state);
        let s;
        if (i > src.length - 1) {
            if (state.in == false) {
                break;
            }
            // Forcefully push last token
            s = null;
            state.skipstatecheck = true;
        } else {
            s = src[i];
        }

        switch (state.in) {
            case 'identifier': {
                if (text.identifier2[s]) {
                    state.current += s;
                } else {
                    tokens.push({
                        type: text.keyword[state.current] ? 'keyword' : 'identifier',
                        value: state.current,
                    });
                    state.in = false;
                }
                break;
            }
            case 'symbol': {
                if (text.symbol[s]) {
                    let nextCurrent = state.current + s;
                    if (!text.operator[nextCurrent] && !text.symbol[nextCurrent]) {
                        tokens.push({
                            type: 'symbol',
                            value: state.current,
                        });
                        state.current = '';
                    }
                    state.current += s;
                } else {
                    tokens.push({
                        type: text.operator[state.current] ? 'operator' : 'symbol',
                        value: state.current,
                    });
                    state.in = false;
                }
                if (state.current == text.comment.start) {
                    state.in = 'comment';
                    state.current = '';
                }
                break;
            }
            case 'shortString': {
                if (state.escape) {
                    let e = text.escape[s];
                    if (!e) {
                        error(`Invalid escape sequence '\\${s}'`);
                    }
                    state.current += e;
                    state.escape = false;
                } else {
                    if (text.shortStringEscape[s]) {
                        state.escape = true;
                    } else if (s == state.stringStart) {
                        tokens.push({
                            type: 'string',
                            value: state.current,
                        });
                        state.in = false;
                        state.skipstatecheck = true;
                    } else {
                        state.current += s;
                    }
                }
                break;
            }
            case 'longString': {
                if (state.escape) {
                    let e = text.escape[s];
                    if (!e) {
                        error(`Invalid escape sequence '\\${s}'`);
                    }
                    state.current += e;
                    state.escape = false;
                } else {
                    if (text.shortStringEscape[s]) {
                        state.escape = true;
                    } else if (s == state.stringStart) {
                        tokens.push({
                            type: 'string',
                            value: state.current,
                        });
                        state.in = false;
                        state.skipstatecheck = true;
                    } else {
                        state.current += s;
                    }
                }
                break;
            }
            case 'whitespace': {
                if (text.whitespace[s]) {
                    state.current += s;
                } else {
                    tokens.push({
                        type: 'whitespace',
                        value: state.current,
                    });
                    state.in = false;
                }
                break;
            }
            case 'number': {
                if (text.number2[s]) {
                    state.current += s;
                } else {
                    tokens.push({
                        type: 'number',
                        value: state.current,
                    });
                    state.in = false;
                }
                break;
            }
            case 'comment': {
                if (src[i - 1] == '*' && s == '/') {
                    tokens.push({
                        type: 'comment',
                        value: state.current.substring(0, state.current.length - 1),
                    });
                    state.in = false;
                    state.skipstatecheck = true;
                } else {
                    state.current += s;
                }
                break;
            }
            case false: {
                // Do nothing
                break;
            }
            default: {
                // Invalid state, should never happen
                error(`Invalid state '${state.in}', should never happen`);
            }
        }




        
        if (state.skipstatecheck) {
            state.skipstatecheck = false;
        } else if (state.in == false) {
            if (text.identifier1[s]) {
                state.in = 'identifier';
                state.current = s;
            } else if (text.symbol[s]) {
                state.in = 'symbol';
                state.current = s;
            } else if (text.shortString[s]) {
                state.in = 'shortString';
                state.current = '';
                state.stringStart = s;
            } else if (text.longString[s]) {
                state.in = 'longString';
                state.current = '';
                state.stringStart = s;
            } else if (text.whitespace[s]) {
                state.in = 'whitespace';
                state.current = s;
            } else if (text.number1[s]) {
                state.in = 'number';
                state.current = s;
            } else {
                // Invalid character, might happen
                error(`Invalid character '${s}'`);
            }
        }
    }

    return tokens;
}


module.exports = lex;