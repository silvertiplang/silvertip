/*
    silvertipjs

    converts arrowtip to js and then runs it
*/




const lex = require('./lex.js');
const parse = require('./parse.js');
const tocpp = require('./tocppnotype.js');
const tojs = require('./tojs.js');
const { printTokens } = require('./utils_debug.js');



function silvertipcpp(src) {
    let tokens = lex(src);
    // printTokens(tokens);

    let ast = parse(tokens);
    // console.log(JSON.stringify(ast, null, 2));
    
    let cpp = tocpp(ast);
    // console.log(js);

    return cpp;
}


module.exports = silvertipcpp;