'use strict';

const {
    compound,
    variable,
    serialize
} = require('swipl').term;

const {
    MAKE,
    MODELS
} = require('../../constants').PROLOG.PREDICATES;

class AccessLayer {
    constructor (swipl) {
        this.swipl = swipl;
    }

    getAllMarks (carStore) {
        const escaped = serialize(
            compound(
                MAKE,
                [
                    carStore,
                    variable('X'),
                    variable('_')
                ]
            )
        );

        return this._requestHandler(escaped);
    }

    getAllModelsByMark (carStore, mark) {
        const escaped = serialize(
            compound(
                MODELS,
                [
                    carStore,
                    mark,
                    variable('X'),
                    variable('_')
                ]
            )
        );

        return this._requestHandler(escaped);
    }

    _requestHandler (predicate) {
        const query = new this.swipl.Query(predicate),
            result = [];

        let ret = null;

        while (ret = query.next()) {
            result.push({
                ['X']: ret.X
            });
        }

        query.close();

        return result;
    }
};

module.exports = AccessLayer;
