/*
    minjs.js

    minify js that is generated from tojs
*/




let UglifyJS = require("uglify-js");

function minifyjs(js) {
    return UglifyJS.minify(js).code;
}

// console.log(minifyjs('let a = 2;;;;'))

module.exports = minifyjs;