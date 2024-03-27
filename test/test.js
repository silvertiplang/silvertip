const main = require('../main');

const fsp = require('fs').promises;

// let fn = 'code.st';
let fn = './parse/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    main(data);
});