const tuple = f => choice(
    seq('(', ')'),
    seq('(', f, ',', repeat(seq(f, ',')), optional(f), ')')
);

const appl = (rhs, $) => seq($.expression, $.term, rhs);

module.exports = grammar({
    name: 'curse',

    rules: {
        source_file: $ => repeat(choice(
            $._definition,
        )),

        _definition: $ => choice(
            $.function_definition,
            $.choice_definition
        ),

        choice_definition: $ => seq(
            'choice',
            repeat1($.named_type),
            '{',
            repeat(seq($.variant, ',')),
            optional($.variant),
            '}',
        ),

        variant: $ => seq($.named_type, $.field_kind),

        field_kind: $ => choice(
            $.type,
            seq(
                '{',
                repeat(seq($.named_field, ',')),
                optional($.named_field),
                '}',
            ),
        ),

        named_field: $ => seq(
            $.identifier,
            ':',
            $.type,
        ),

        function_definition: $ => seq(
            'fn',
            $.identifier,
            optional($.type_signature),
            $.closure,
        ),

        type_signature: $ => seq(
            ':',
            $.type,
        ),

        type: $ => choice(
            seq($.start_type, $.start_type, '->', $.type),
            $.start_type,
        ),

        start_type: $ => choice(
            $.named_type,
            tuple($.type),
            seq('(', $.type, ')'),
        ),

        closure: $ => choice(
            $.non_piecewise_closure,
            $.piecewise_closure,
        ),

        non_piecewise_closure: $ => $.arm,
        piecewise_closure: $ => seq(
            '{',
            $.arm,
            repeat(seq(',', $.arm)),
            optional(','),
            '}',
        ),

        arm: $ => seq(
            '|',
            repeat(seq($.param, ',')),
            optional($.param),
            '|',
            $.end_expression,
        ),

        expression: $ => choice(
            $.term,
            appl($.term, $)
        ),

        end_expression: $ => choice(
            $.end_term,
            appl($.end_term, $)
        ),

        term: $ => choice(
            seq('(', $.end_expression, ')'),
            $.symbol,
            $.literal,
            $.variable,
            tuple($.end_expression),
            $.piecewise_closure,
        ),

        end_term: $ => choice(
            $.term,
            $.non_piecewise_closure,
        ),

        param: $ => seq(
            $.pattern,
            optional(seq(':', $.type)),
        ),

        pattern: $ => choice(
            $.literal,
            $.param_name,
            tuple($.pattern),
        ),

        param_name: $ => $.identifier,

        literal: $ => choice(
            $.integer,
            'true',
            'false',
        ),

        variable: $ => $.identifier,

        identifier: $ => /[_a-z][_a-zA-Z0-9]*/,
        named_type: $ => /[A-Z][a-zA-Z0-9_]*/,

        integer: $ => /[0-9]+/,

        symbol: $ => choice(
            '+', '-', '*', '.', '..', ';', '%', '/',
            '=', '<', '>', '<=', '>=',
        ),
    }
});
