'use strict';

const path = require('path');

const slash = require('slash');
const _ = require('lodash');

const {
    compound,
    variable,
    serialize
} = require('./node-prolog/term');

class AccessLayer {
    constructor (executor) {
        this.executor = executor;

        const prologFile = slash(path.resolve(__dirname, 'database'));

        // Creating such promise to ensure data base will be filled with values before quering it
        let executorTop;

        this.executor(`consult('${prologFile}')`)
            .then(executor => {
                executorTop = executor;
                return executor.next();
            })
            .then(() => executorTop.close());
    }

    async find (model, criteria) {
        // All 'table' columns
        const keys = Object.values(model.scheme);

        // Predicate name
        const predicate = model.name;
        const query = [];

        // If some column is in criteria, this column should be exact value in PL query
        // Otherwise adding variable that will be matched by PL
        keys.forEach(key => {
            if (key in criteria) {
                query.push(criteria[key]);
            } else {
                query.push(variable(key));
            }
        });

        const queryResult = await this._requestHandler(predicate, query);

        const searchResult = [];

        // Creating array of objects that have exactly all properties from Model's scheme
        // If some value is provided as criteria it will not appear in PL response object
        // But we know it, so we use it
        // Otherwise, if some key was not specified, code above created dynamic variable
        // This variable is resolved by PL, so returned object has this key
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

    /**
     * Query executor
     * Currently returns array of fetched data from prolog without any processing
     *
     * Note:
     * PL returns false if it cannot match query
     * PL returns {} if it has fully matched query and there was single value
     *
     * Example:
     * {
     *      'MarkName': 'Dacia',
     *      'ID': '17'
     * } --> will evaluate to {} because there are no variables
     *
     * {
     *      'MarkName': 'Dacia'
     * } --> will evaluate to {ID: '17'} because there is variable ID
     * */
    async _requestHandler (predicate, compoundParams) {
        const escaped = serialize(
            compound(
                predicate,
                compoundParams
            )
        );

        const prologQueryObject = await this.executor(escaped);

        const result = [];

        try {
            let ret;

            while (ret = await prologQueryObject.next()) {
                result.push(ret);
            }
        } finally {
            await prologQueryObject.close();
        }

        return result;
    }
};

module.exports = AccessLayer;
