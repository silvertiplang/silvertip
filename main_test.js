/*
    main.js

    main file to invoke the lexer, parser, and transpiler to produce c++
*/




const lex = require('./lex.js');
const parse = require('./parse.js');
const tojs = require('./tojs.js');
const { printTokens, concatTokens } = require('./utils_debug.js');



function main(src) {
    let tokens = lex(src);
    // printTokens(tokens);

    let ast = parse(tokens);
    // console.log(JSON.stringify(ast, null, 2));
    
    let js = tojs(ast);
    console.log(js)

}


module.exports = main;