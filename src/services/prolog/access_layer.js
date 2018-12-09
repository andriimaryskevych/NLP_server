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

const {
    Mark,
    Model
} = require('./models');

class AccessLayer {
    constructor (swipl) {
        this.swipl = swipl;
    }

    getAllMarks (carStore) {
        return new Promise(resolve => {
            const makeName = 'Make',
                id = 'Id';

            const queryResult = this._requestHandler(
                MAKE,
                [
                    carStore,
                    variable(makeName),
                    variable(id)
                ]
            );

            const requestedMarks = [];

            queryResult.forEach(mark => {
                requestedMarks.push(new Mark(carStore, mark[makeName], mark[id]));
            });

            resolve(requestedMarks);
        });
    }

    getAllModelsByMark (carStore, mark) {
        return new Promise(resolve => {
            const modelName = 'Model',
                id = 'Id';

            const queryResult = this._requestHandler(
                MODELS,
                [
                    carStore,
                    mark,
                    variable(modelName),
                    variable(id)
                ]
            );

            const requestedModels = [];

            queryResult.forEach(model => {
                requestedModels.push(new Model(
                        carStore,
                        mark,
                        model[modelName],
                        model[id]
                    )
                );
            });

            resolve(requestedModels);
        });
    }

    _requestHandler (predicate, compoundParams) {
        const escaped = serialize(
            compound(
                predicate,
                compoundParams
            )
        );

        const query = new this.swipl.Query(escaped),
            result = [];

        let ret = null;

        while (ret = query.next()) {
            result.push(ret);
        }

        // Closing query which has not returned any value causes error
        if (result.length !== 0) {
            query.close();
        }

        return result;
    }
};

module.exports = AccessLayer;
