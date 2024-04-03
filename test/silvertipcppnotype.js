const silvertipjs = require('../silvertipcppnotype');
const main = require('../main');

const fsp = require('fs').promises;

let fn = './silvertipcppnotype/test.st';
// let fn = './parse/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    let cpp = silvertipjs(data);
    fsp.writeFile('./silvertipcppnotype/out.cpp', cpp);
});

