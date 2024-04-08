// TODO: IMPLEMENT OPTIMIZATION FLAGS: https://stackoverflow.com/a/55229614

const silvertipjs = require('../silvertipcppnotype');
const main = require('../main_test');

const fsp = require('fs').promises;

let fn = './silvertipcppnotype/test.st';
// let fn = './parse/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    let cpp = silvertipjs(data);
    fsp.writeFile('./silvertipcppnotype/out.cpp', cpp);
});

