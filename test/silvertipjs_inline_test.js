const lex = require('../lex');
const parse = require('../parse');
const silvertipjs = require('../silvertipjs');
const tojs = require('../tojs');
const tolua = require('../tolua');

let src = `
// local a, b = 1, 2
// local a = [1, 2, 3]
// local b = {a: 2, b: 3}
local function a() {
    return 1, 2
}
`;

// silvertipjs(data);

let tokens = lex(src);
// printTokens(tokens);

let ast = parse(tokens);
console.log(JSON.stringify(ast, null, 2));

let js = tojs(ast);
console.log(js);

let lua = tolua(ast);
console.log(lua);

// return eval(js);