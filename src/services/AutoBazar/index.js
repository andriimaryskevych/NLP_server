'use strict';

const _ = require('lodash');

const {
    Mark,
    Model
} = require('../../models');

const constants = require('../../constants');


const {
    STORE_NAME: MARK_STORE_NAME
} = Mark.scheme;

const {
    STORE_NAME: MODEL_STORE_NAME
} = Model.scheme;

const {
    AUTOBAZAR
} = constants.CAR_STORE;

class AutoBazar {
    getMark (criteria) {
        const mergedCriteria = _.merge(
            {},
            criteria,
            {
                [MARK_STORE_NAME]: AUTOBAZAR
            }
        );

        return Mark.find(mergedCriteria);
    }

    getModel (criteria) {
        const mergedCriteria = _.merge(
            {},
            criteria,
            {
                [MODEL_STORE_NAME]: AUTOBAZAR
            }
        );

        return Model.find(mergedCriteria);
    }
}

const instance = new AutoBazar();

module.exports = instance;
