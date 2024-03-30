local a = b, c -> {return b + c}

local z = console.log

z(a(1, 2))
// console.log(a(1, 2))


local t = {a: 2, b: 3}
t -> a {console.log(a)}