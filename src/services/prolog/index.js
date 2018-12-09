const path = require('path');

const swipl = require('swipl');
const slash = require('slash');

const AccessLayer = require('./access_layer');

const prologFile = slash(path.resolve(__dirname, 'database'));

swipl.call(`consult('${prologFile}')`);

const instance = new AccessLayer(swipl);

module.exports = instance;
