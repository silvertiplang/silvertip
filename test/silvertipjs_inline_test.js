const lex = require('../lex');
const parse = require('../parse');
const silvertipjs = require('../silvertipjs');
const tojs = require('../tojs');

let src = `
a()
b()

a -> b
1 -> a
`;

// silvertipjs(data);

let tokens = lex(src);
// printTokens(tokens);

let ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));

let js = tojs(ast);
console.log(js);

// return eval(js);