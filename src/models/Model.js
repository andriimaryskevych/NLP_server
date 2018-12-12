'use strict';

const { MODEL } = require('../constants').PROLOG.PREDICATES;

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

    static find (criteria) {
        return prolog.find(this, criteria);
    }
};

module.exports = Model;
