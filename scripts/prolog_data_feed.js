const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const prolog = require('../src/services/prolog');

const fileToRead = path.resolve(__dirname, '../', 'JSON_database', 'AUTO_RIA', 'models.json');

const makeArray = JSON.parse(fs.readFileSync(fileToRead, 'utf8'));
const storeName = 'AUTO_RIA';

const getModelName = 'name';
const getModelValue = 'value';

Object.keys(makeArray).forEach(item => {
    makeArray[item].forEach(model => {
        console.log(`assert_model('${storeName}', '${item}', '${_.get(model, getModelName)}', '${_.get(model, getModelValue)}')`);
        prolog.call(`assert_model('${storeName}', '${item}', '${_.get(model, getModelName)}', '${_.get(model, getModelValue)}')`);
    });
});
