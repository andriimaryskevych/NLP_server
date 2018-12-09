const fs = require('fs');
const path = require('path');

const axios = require('axios');
const _ = require('lodash');

const fileToRead = path.resolve(__dirname, '../', 'JSON_database', 'AutoBazar', 'make.json');
const fileToWrite = path.resolve(__dirname, '../', 'JSON_database', 'AutoBazar', 'models.json');

const make = JSON.parse(fs.readFileSync(fileToRead, 'utf8'));

const apiEndpoitForMake = make => `https://ab.ua/api/transports/models/?make=${make}`;

const promises = [];

make.forEach(make => {
    promises.push(
        axios.get(
            apiEndpoitForMake(make.id),
            {
                headers: {
                    'X-API-Make': make.title
                }
            }
        )
    );
});

const pathToMake = 'config.headers.X-API-Make';
const pathToData = 'data';


Promise.all(promises)
    .then(responseArray => {
        const models = {};

        responseArray.forEach(item => {
            const key = _.get(item, pathToMake);
            const value = _.get(item, pathToData);

            models[key] = value
        });

        return models;
    })
    .then(models => {
        fs.writeFile(
            fileToWrite,
            JSON.stringify(models, null, 4),
            'utf-8',
            () => {}
        );
    })
