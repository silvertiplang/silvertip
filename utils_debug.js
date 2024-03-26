/*
    utils.js

    various utilities that make debugging and inspection much easier
*/




function printTokens(tokens) {
    let out = [];
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        out.push(token.type + ' ' + JSON.stringify(token.value));
    }
    let s = out.join('\n');
    console.log(s);
}

function concatTokens(tokens) {
    // TODO: Serialize strings properly (include quotes and escape)
    let s = '';
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        s += token.value;
    }
    return s;
}


module.exports = {printTokens, concatTokens};