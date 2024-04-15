const lex = require('../lex');
const parse = require('../parse');
const silvertipjs = require('../silvertipjs');
const tojs = require('../tojs');
const tolua = require('../tolua');
const { assignParents } = require('../utils');
const { printAST } = require('../utils_debug');

let src = `
// local a, b = 1, 2
// local a = [1, 2, 3]
// local b = {a: 2, b: 3}
local function a() {
    return 1, 2
}
console.log(a())
`;

src = `
// local function a() {
//     return 1
// }
// local function b() {
//     return a()
// }
// local a = [a()]
// a(a())

// local a = a() && 1
// local a = a() + 1
local a = -a()
// local a = {[a()]: 2}
// local a = {a: a()}
// local a = a[a()]

// local a = a()[1][1].as

// a -> a -> a -> a -> a -> a

// 2, 3 -> local a, b
// local a, b = a(), 2

// a, b -> a
`

// silvertipjs(data);

let tokens = lex(src);
// printTokens(tokens);

let ast = parse(tokens);
printAST(ast);

let js = tojs(ast);
console.log(js);

// let lua = tolua(ast);
// console.log(lua);

// return eval(js);

