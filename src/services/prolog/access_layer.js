'use strict';

const _ = require('lodash');

const {
    compound,
    variable,
    serialize
} = require('swipl').term;

class AccessLayer {
    constructor (swipl) {
        this.swipl = swipl;
    }

    find (model, criteria) {
        const keys = Object.values(model.scheme);

        const predicate = model.name;
        const query = [];

        keys.forEach(key => {
            if (key in criteria) {
                query.push(criteria[key]);
            } else {
                query.push(variable(key));
            }
        });

        const queryResult = this._requestHandler(predicate, query);

        const searchResult = [];

        queryResult.forEach(response => {
            const res = {};

            keys.forEach(key => {
                if (key in criteria) {
                    res[key] = criteria[key];
                } else {
                    res[key] = response[key];
                }
            });

            searchResult.push(res);
        });

        return searchResult;
    }

    _requestHandler (predicate, compoundParams) {
        const escaped = serialize(
            compound(
                predicate,
                compoundParams
            )
        );

        const prologQueryObject = new this.swipl.Query(escaped),
            result = [];

        let ret = null;

        while (ret = prologQueryObject.next()) {
            result.push(ret);
        }

        prologQueryObject.close();

        return result;
    }
};

module.exports = AccessLayer;
