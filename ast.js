/*
    ast.js

    stores the ast format, configurable
*/





// https://github.com/fstirlitz/luaparse/blob/0f525b152516bc8afa34564de2423b039aa83bc1/luaparse.js#L228
// Documentation and modifiable AST
let ast = {
    breakStatement: function() {
        return {
            type: 'BreakStatement'
        };
    },
    
    continueStatement: function() {
        return {
            type: 'ContinueStatement'
        };
    },

    returnStatement: function(args) {
        return {
            type: 'ReturnStatement',
            arguments: args
        }
    },

    ifStatement: function(clauses) {
        return {
            type: 'IfStatement',
            clauses: clauses
        };
    },
    ifClause: function(condition, body) {
        return {
            type: 'IfClause',
            condition: condition,
            body: body
        };
    },
    elseIfClause: function(condition, body) {
        return {
            type: 'ElseIfClause',
            condition: condition,
            body: body
        };
    },
    elseClause: function(body) {
        return {
            type: 'ElseClause',
            body: body
        };
    },

    whileStatement: function(condition, body) {
        return {
            type: 'WhileStatement',
            condition: condition,
            body: body
        };
    },

    repeatStatement: function(condition, body) {
        return {
            type: 'RepeatStatement',
            condition: condition,
            body: body
        };
    },

    localStatement: function(variables, init) {
        return {
            type: 'LocalStatement',
            variables: variables,
            init: init
        };
    },
    
    globalStatement: function(variables, init) {
        return {
            type: 'GlobalStatement',
            variables: variables,
            init: init
        };
    },

    assignmentStatement: function(variables, init) {
        return {
            type: 'AssignmentStatement',
            variables: variables,
            init: init
        };
    },

    operationAssignment: function(operation, variables, init) {
        return {
            type: 'OperationAssignment',
            operation: operation,
            variables: variables,
            init: init
        };
    },

    callStatement: function(base, args) {
        return {
            type: 'CallStatement',
            base: base,
            arguments: args
        };
    },

    // localFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'LocalFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    // globalFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'GlobalFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    // assignmentFunctionDeclaration: function(identifier, parameters, body) {
    //     return {
    //         type: 'AssignmentFunctionDeclaration',
    //         identifier: identifier,
    //         parameters: parameters,
    //         body: body
    //     };
    // },

    forNumericStatement: function(variable, start, end, step, body) {
        return {
            type: 'ForNumericStatement',
            variable: variable,
            start: start,
            end: end,
            step: step,
            body: body
        };
    },

    forGenericStatement: function(objectVariable, valueVariable, keyVariable, body) {
        return {
            type: 'ForGenericStatement',
            objectVariable: objectVariable,
            valueVariable: valueVariable,
            keyVariable: keyVariable,
            body: body
        };
    },

    chunk: function(body) {
        return {
            type: 'Chunk',
            body: body
        };
    },

    asyncStatement: function(body) {
        return {
            type: 'AsyncStatement',
            body: body
        };
    },

    identifier: function(name) {
        return {
            type: 'Identifier',
            name: name
        };
    },

    // literal: function(type, value) {
    //     // Type can be 'StringLiteral', 'NumericLiteral', 'BooleanLiteral', 'NullLiteral', 'VarargLiteral'
  
    //     return {
    //         type: type,
    //         value: value,
    //     };
    // },
    stringLiteral: function(value) {
        return {
            type: 'StringLiteral',
            value: value,
        };
    },
    numericLiteral: function(value) {
        return {
            type: 'NumericLiteral',
            value: value,
        };
    },
    booleanLiteral: function(value) {
        return {
            type: 'BooleanLiteral',
            value: value,
        };
    },
    nullLiteral: function(value) {
        return {
            type: 'NullLiteral',
            value: value,
        };
    },
    varargLiteral: function(value) { // ATODO
        return {
            type: 'VarargLiteral',
            value: value,
        };
    },

    tableEntry: function(key, value) {
        return {
            type: 'TableEntry',
            key: key,
            value: value
        };
    },
    
    arrayConstructorExpression: function(list) {
        return {
            type: 'ArrayConstructorExpression',
            list: list
        };
    },
    tableConstructorExpression: function(fields) {
        return {
            type: 'TableConstructorExpression',
            fields: fields
        };
    },
    logicalExpression: function(operator, left, right) {
        return {
            type: 'LogicalExpression',
            operator: operator,
            left: left,
            right: right
        };
    },
    binaryExpression: function(operator, left, right) {
        return {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right
        };
    },
    unaryExpression: function(operator, argument) {
        return {
            type: 'UnaryExpression',
            operator: operator,
            argument: argument
        };
    },
    indexExpression: function(base, index) {
        return {
            type: 'IndexExpression',
            base: base,
            index: index
        };
    },
    lambdaExpression: function(parameters, body) {
        return {
            type: 'LambdaExpression',
            parameters: parameters,
            body: body
        };
    },

    comment: function(value) { // ATODO
        return {
            type: 'Comment',
            value: value,
        };
    },

    whitespace: function(value) { // ATODO
        return {
            type: 'Whitespace',
            value: value,
        };
    }
};




module.exports = ast;