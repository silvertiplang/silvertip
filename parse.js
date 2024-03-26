/*
    parse.js

    convert tokens into an AST
*/




const { error } = require("./utils");




function parse(tokens) {
    let out = {}; // Root of the tree
    let node = out; // Current node
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        switch (token.type) {
            case 'identifier': {
                
                break;
            }
            case 'keyword': {

                break;
            }
            case 'symbol': {

                break;
            }
            case 'operator': {

                break;
            }
            case 'comment': {

                break;
            }
            case 'string': {

                break;
            }
            case 'whitespace': {

                break;
            }
            case 'number': {

                break;
            }
            default: {
                error(`Invalid token type '${token.type}'`);
            }
        }
    }

    return out;
}


module.exports = parse;