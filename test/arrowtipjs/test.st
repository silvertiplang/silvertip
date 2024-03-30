local a = b, c -> {return b + c}

local z = console.log

z(a(1, 2))
// console.log(a(1, 2))