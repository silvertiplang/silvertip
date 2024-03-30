/*
    arrowtipjs

    converts arrowtip to js and then runs it
*/




const lex = require('./lex.js');
const parse = require('./parse.js');
const tojs = require('./tojs.js');
const { printTokens } = require('./utils_debug.js');



function arrowtipjs(src) {
    let tokens = lex(src);
    // printTokens(tokens);

    let ast = parse(tokens);
    console.log(JSON.stringify(ast, null, 2));
    
    let js = tojs(ast);
    // console.log(js);

    return eval(js);
}


module.exports = arrowtipjs;