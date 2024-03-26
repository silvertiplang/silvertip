const main = require('../main');

const fsp = require('fs').promises;


fsp.readFile('code.st', 'utf8').then(data => {
    main(data);
});