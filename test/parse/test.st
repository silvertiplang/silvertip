// // breakStatement
// break

// // continueStatement
// continue

// // returnStatement
// return 1
// return 1, 2, 3
// return 1 + 2 + 3

// // ifStatement, ifClause, elseIfClause, elseClause
// if 1 {}
// if 1 {} elseif 2 {}
// if 1 {} elseif 2 {} elseif 3 {}
// if 1 {} else {}
// if 1 {} elseif 2 {} elseif 3 {} else {}
// if 1 + 2 + 3 {}

// // whileStatement
// while 1 {}
// while 1 + 2 + 3 {}

// // repeatStatement
// repeat {}
// repeat {} until 1
// repeat {} until 1 + 2 + 3

// // localStatement, globalStatement, assignmentStatement

// local a
// local a = 1
// local a, b, c = 1, 2, 3
// local function a() {}
// local function a(a, b, c) {}
// function a() {}
// a = 1
// a, b, c = 1, 2, 3

// // operationAssignment
// a += 1
// a, b, c += 1, 2, 3

// // callStatement
// a()
// a(1, 2, 3)
// a(1 + 2 + 3)

// // forNumericStatement
// a = 1 -> 2 {}
// a = 1 + 1 -> 3 {}

// // forGenericStatement
// a -> b {}

// // chunk
// // {}

// // asyncStatement
// async {}

// // identifier
// console.log(2)
// a.b.c = 1
// a -> b {}
// a = b, c -> {return b + c}
// console.log(a(2, 3))

// // literal

// local a = true

// local a = false

// local a = null

// local a = 'string'

// local a = 123

// // arrayConstructorExpression
// local a = []
// local a = [1, 2, 3]

// // tableConstructorExpression, tableEntry
// local a = {}
// local a = {a: 1}
// local a = {['a']: 2}

// // binaryExpression
// a = 1 + 2 + 3

// // unaryExpression
// a = -1

// // indexExpression
// local a = a.b
// local a = a.b.c
// local a = a['b']
// local a = a['b']['c']

// // lambdaExpression
// local a = () -> {}
// local a = (a, b, c) -> {return 1}
// local a = (a, b, c) -> a + b + c
// local a = a -> {}
// local a = a, b, c -> {}

// // comment

// // whitespace




// // Pipe testing
// 1 -> a
// 1, 2 -> b
// 1, 2 -> a -> b -> c
// 'a' -> a
// 1 + 2 -> a
// 1 -> a -> local a, b
// 1, 2 -> local a, b