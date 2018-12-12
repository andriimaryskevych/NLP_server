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

        return new Promise(resolve => {
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

            resolve(searchResult);
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
            try {
                // query.close();
            } catch (e) {
                console.log(e);
            }

        return result;
    }
};

module.exports = AccessLayer;
