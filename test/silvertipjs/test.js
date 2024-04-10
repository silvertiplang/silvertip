function a() {
    return [1, 2];
}

// let b = ...a() + 1
let b = a()[0] + 1
console.log(...a());

let c = -a()[0]
console.log(c)