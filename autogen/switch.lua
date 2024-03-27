local t = {'local', 'global', 'function', 'return', 'while', 'until', 'repeat', 'break', 'continue', 'if', 'elseif', 'else', 'async', 'true', 'false', 'null'}

local out = {}

for i = 1, #t do
    local a = t[i]
    out[#out + 1] = [[
                    case ']] .. a .. [[': {

                        break;
                    }
]]
end

print(table.concat(out))