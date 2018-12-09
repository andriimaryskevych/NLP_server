const swipl = require('swipl');
const { compound, variable, serialize } = swipl.term;

const escaped = serialize(
        compound(
            'make',
            [
                variable('X'),
                variable('_')
            ]
        )
    );

console.log(escaped);