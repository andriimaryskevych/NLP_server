const swipl = require('swipl');
const prolog = require('../src/services/prolog');
const { compound, variable, serialize } = swipl.term;

const escaped = serialize(
        compound(
            'make',
            [
                'r',
                variable('X'),
                variable('_')
            ]
        )
    );

const query = new swipl.Query(escaped),
    result = [];

let ret = null;

while (ret = query.next()) {
    result.push(ret);
}

console.log(result);