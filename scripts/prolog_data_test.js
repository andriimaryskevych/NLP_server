const prolog = require('../src/services/prolog');
const {
    AUTO_RIA,
    AUTOBAZAR
} = require('../src/constants').CAR_STORE

const {
    Mark
} = require('../src/services/prolog/models');

console.log(new Mark());

console.log(prolog.getAllMarks(AUTOBAZAR));

// console.log(prolog.getAllModelsByMark(AUTO_RIA, 'BMW'));

// const swipl = require('swipl');
// const { compound, variable, serialize } = swipl.term;

// const escaped = serialize(
//     compound(
//         'model',
//         [
//             variable('Store'),
//             'BMW',
//             variable('X'),
//             variable('_')
//         ]
//     )
// );

// let query = new swipl.Query(escaped);

// let ret = null;

// while (ret = query.next()) {
//     console.log(`${ret.Store} has BMW ${ret.X}`);
// }


// query = new swipl.Query(escaped);

// ret = null;

// while (ret = query.next()) {
//     console.log(`${ret.Store} has BMW ${ret.X}`);
// }

