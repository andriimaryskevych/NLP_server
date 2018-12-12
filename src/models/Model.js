'use strict';

const { MODEL } = require('../constants').PROLOG.PREDICATES;

const prolog = require('../services/prolog');

class Model {
    constructor (store, mark, name, id) {
        Object.assign(this, {
            store,
            mark,
            name,
            id
        });
    }

    static get scheme () {
        return {
            STORE_NAME: 'StoreName',
            MARK_NAME: 'MarkName',
            MODEL_NAME: 'ModelName',
            ID: 'ID'
        }
    }

    static get name () {
        return MODEL;
    }

    static async find (criteria) {
        const DB_result = await prolog.find(this, criteria);

        const {
            STORE_NAME,
            MARK_NAME,
            MODEL_NAME,
            ID
        } = this.scheme;

        const mappedResponse = [];

        DB_result.forEach(row => {
            mappedResponse.push(new Model(
                row[STORE_NAME],
                row[MARK_NAME],
                row[MODEL_NAME],
                row[ID]
            ))
        });

        return mappedResponse;
    }
};

module.exports = Model;
