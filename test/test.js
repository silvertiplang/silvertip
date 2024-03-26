const main = require('../main');

const fsp = require('fs').promises;

// let fn = 'code.st';
let fn = './lex/test.st';

fsp.readFile(fn, 'utf8').then(data => {
    main(data);
});