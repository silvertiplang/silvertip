/*
    minjs.js

    minify js that is generated from tojs
*/




const { minify_sync } = require("terser");

function minifyjs(js) {
    return minify_sync(js).code;
}

// console.log(minifyjs('let a = 2;;;;'))

module.exports = minifyjs;