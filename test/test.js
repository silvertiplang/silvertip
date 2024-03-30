const arrowtipjs = require('../silvertipjs');
const main = require('../main');

const fsp = require('fs').promises;

let fn = './silvertipjs/test.st';
// let fn = './parse/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    arrowtipjs(data);
});

