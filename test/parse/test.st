local a
local a = 1
local a, b, c = 1, 2, 3
local function a() {}
local function a(a, b, c) {}
function a() {}


global a
global a = 1
global a, b, c = 1, 2, 3

return 1
return 1, 2, 3

while 1 {}

repeat {}
repeat {} until 1

break

continue

if 1 {}
if 1 {} elseif 2 {}
if 1 {} elseif 2 {} elseif 3 {}
if 1 {} elseif 2 {} elseif 3 {} else {}

async {}

local a = true

local a = false

local a = null

// comment

local a = 'string'

local a = 123