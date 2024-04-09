/*
    beautifyjs.js

    beautify js that is generated from tojs

    https://github.com/mishoo/UglifyJS?tab=readme-ov-file#keeping-copyright-notices-or-other-comments
*/


const prettier = require("prettier/standalone");


async function beautifyjs(js) {
    return await prettier.format(js, {parser: 'babel'});
}

// console.log(beautifyjs('let b=2;;;;'))

module.exports = beautifyjs;