const path = require('path');

const swipl = require('swipl');
const slash = require('slash');

const prologFile = slash(path.resolve(__dirname, 'database'));

swipl.call(`consult('${prologFile}')`);

module.exports = swipl;
