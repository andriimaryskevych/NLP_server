'use strict';

const querystring = require('querystring');
const _ = require('lodash');

const {
    Mark,
    Model
} = require('../../models');

const constants = require('../../constants');


const {
    STORE_NAME: MARK_STORE_NAME,
    MARK_NAME: MARK_MARK_NAME
} = Mark.scheme;

const {
    STORE_NAME: MODEL_STORE_NAME,
    MARK_NAME: MODEL_MARK_NAME,
    MODEL_NAME
} = Model.scheme;

const {
    AUTO_RIA
} = constants.CAR_STORE;

const {
    MARK,
    MODEL,
    PRODUCTION_YEAR_FROM,
    PRODUCTION_YEAR_TO,
    PRICE_FROM,
    PRICE_TO
} = constants.SEARCH_FILTER;

const mappedForAutoRIA = {
    [MARK]: 'marka_id',
    [MODEL]: 'model_id',
    [PRODUCTION_YEAR_FROM]: 's_years',
    [PRODUCTION_YEAR_TO]: 'po_yers',
    [PRICE_FROM]: 'price_ot',
    [PRICE_TO]: 'price_do'
};

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

    async applyFilters (filters) {
        const searchQuery = {};

        if (MARK in filters) {
            const [mark] = await this.getMark({
                [MARK_MARK_NAME]: filters[MARK]
            });

            if (!mark.id) {
                throw new Error(`Mark ${filters[MARK]} not found`);
            }

            searchQuery[mappedForAutoRIA[MARK]] = mark.id;
        }

        if (MODEL in filters && MARK in filters) {
            const [model] = await this.getModel({
                [MODEL_NAME]: filters[MODEL],
                [MODEL_MARK_NAME]: filters[MARK]
            });

            if (!model.id) {
                throw new Error(`Model ${filters[MODEL]} not found`);
            }

            searchQuery[mappedForAutoRIA[MODEL]] = model.id;
        }

        [
            PRODUCTION_YEAR_FROM,
            PRODUCTION_YEAR_TO,
            PRICE_FROM,
            PRICE_TO
        ].forEach(criteria => {
            searchQuery[mappedForAutoRIA[criteria]] = filters[criteria];
        })

        const query = querystring.stringify(JSON.parse(JSON.stringify(searchQuery)));

        return query;
    }

    async buildSearchURL (filters) {
        const queryString = await this.applyFilters(filters);

        return `https://developers.ria.com/auto/search?api_key=EXn6yA6Az0ZYRql5IG2wHuziX4NCDaxUBfPCnPW4&${queryString}`;
    }
}

const instance = new AutoRia();

module.exports = instance;
