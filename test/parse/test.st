// breakStatement
break

// continueStatement
continue

// returnStatement
return 1
return 1, 2, 3
return 1 + 2 + 3

// ifStatement, ifClause, elseIfClause, elseClause
if 1 {}
if 1 {} elseif 2 {}
if 1 {} elseif 2 {} elseif 3 {}
if 1 {} else {}
if 1 {} elseif 2 {} elseif 3 {} else {}
if 1 + 2 + 3 {}

// whileStatement
while 1 {}
while 1 + 2 + 3 {}

// repeatStatement
repeat {}
repeat {} until 1
repeat {} until 1 + 2 + 3

// localStatement, globalStatement, assignmentStatement

local a
local a = 1
local a, b, c = 1, 2, 3
local function a() {}
local function a(a, b, c) {}
function a() {}
a = 1
a, b, c = 1, 2, 3

// operationAssignment
a += 1
a, b, c += 1, 2, 3

// callStatement
a()
a(1, 2, 3)
a(1 + 2 + 3)

// forNumericStatement
a = 1 -> 2 {}
a = 1 + 1 -> 3 {}

// forGenericStatement

// chunk
// {}

// asyncStatement
async {}

// identifier

// literal

local a = true

local a = false

local a = null

local a = 'string'

local a = 123

// arrayEntry

// tableEntry

// arrayConstructorExpression

// tableConstructorExpression

// binaryExpression
a = 1 + 2 + 3

// unaryExpression
a = -1

// indexExpression

// lambdaExpression

// comment

// whitespace
