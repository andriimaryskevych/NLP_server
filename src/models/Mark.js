'use strict';

const prolog = require('../services/prolog');

const { MARK } = require('../constants').PROLOG.PREDICATES;

class Mark {
    constructor (store, name, id) {
        Object.assign(this, {
            store,
            name,
            id
        });
    }

    static get scheme () {
        return {
            STORE_NAME: 'StoreName',
            MARK_NAME: 'MarkName',
            ID: 'ID'
        }
    }

    static get name () {
        return MARK;
    }

    static async find (criteria) {
        const DB_result = await prolog.find(this, criteria);

        const {
            STORE_NAME,
            MARK_NAME,
            ID
        } = this.scheme;

        const mappedResponse = [];

        DB_result.forEach(row => {
            mappedResponse.push(new Mark(
                row[STORE_NAME],
                row[MARK_NAME],
                row[ID]
            ))
        });

        return mappedResponse;
    }
};

module.exports.Mark = Mark;
