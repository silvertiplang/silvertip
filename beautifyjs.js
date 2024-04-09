/*
    beautifyjs.js

    beautify js that is generated from tojs

    https://github.com/mishoo/UglifyJS?tab=readme-ov-file#keeping-copyright-notices-or-other-comments
*/


let UglifyJS = require("uglify-js");

function beautifyjs(js) {
    return UglifyJS.minify(js, {
        output: {
            comments: 'all',
            beautify: true
        }
    }).code;
}

// console.log(beautifyjs('let b=2;;;;'))

module.exports = beautifyjs;