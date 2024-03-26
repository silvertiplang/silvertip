local t = {}

print()

for i = ('a'):byte(), ('z'):byte() do
    t[#t + 1] = '\'' .. string.char(i) .. '\''
end

for i = ('A'):byte(), ('Z'):byte() do
    t[#t + 1] = '\'' .. string.char(i) .. '\''
end

print(table.concat(t, ', '))