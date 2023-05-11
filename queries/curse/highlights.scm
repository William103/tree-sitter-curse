"fn" @keyword
"choice" @keyword
"true" @constant.builtin
"false" @constant.builtin

(param_name) @variable.parameter
(literal) @variable
(integer) @number
(symbol) @operator
(named_type) @type

["{" "}" "(" ")"] @punctuation.bracket
["," "|" "->" ":"] @punctuation.delimiter
