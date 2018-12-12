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
    AUTO_RIA
} = constants.CAR_STORE;

/**
 * To search for cars using AutoRia.com API we need to query ids, that match our filters
 * https://developers.ria.com/auto/search
 *
 * Later for each needed id, separate request will fetch all data
 * https://developers.ria.com/auto/search?auto_id={{ad id}}
 */
class AutoRia {
    getMark (criteria) {
        const mergedCriteria = _.merge(
            {},
            criteria,
            {
                [MARK_STORE_NAME]: AUTO_RIA
            }
        );

        return Mark.find(mergedCriteria);
    }

    getModel (criteria) {
        const mergedCriteria = _.merge(
            {},
            criteria,
            {
                [MODEL_STORE_NAME]: AUTO_RIA
            }
        );

        return Model.find(mergedCriteria);
    }
}

const instance = new AutoRia();

module.exports = instance;
