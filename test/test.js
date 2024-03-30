const arrowtipjs = require('../arrowtipjs');
const main = require('../main');

const fsp = require('fs').promises;

// let fn = './arrowtipjs/test.st';
let fn = './parse/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    arrowtipjs(data);
});

