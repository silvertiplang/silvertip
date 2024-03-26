/*
    main.js

    main file to invoke the lexer, parser, and transpiler to produce c++
*/




const lex = require('./lex.js');
const { printTokens, concatTokens } = require('./utils_debug.js');



function main(src) {
    let tokens = lex(src);
    printTokens(tokens);


}


module.exports = main;