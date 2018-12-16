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
    AUTOBAZAR
} = constants.CAR_STORE;

const {
    MARK,
    MODEL,
    PRODUCTION_YEAR_FROM,
    PRODUCTION_YEAR_TO,
    PRICE_FROM,
    PRICE_TO
} = constants.SEARCH_FILTER;

const mappedForAutoBazar = {
    [MARK]: 'make',
    [MODEL]: 'model',
    [PRODUCTION_YEAR_FROM]: 'year_from',
    [PRODUCTION_YEAR_TO]: 'year_to',
    [PRICE_FROM]: 'price_from',
    [PRICE_TO]: 'price_to'
};

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

    async applyFilters (filters) {
        const searchQuery = {};

        if (MARK in filters) {
            const [mark] = await this.getMark({
                [MARK_MARK_NAME]: filters[MARK]
            });

            if (!mark.id) {
                throw new Error(`Mark ${filters[MARK]} not found`);
            }

            searchQuery[mappedForAutoBazar[MARK]] = mark.id;
        }

        if (MODEL in filters && MARK in filters) {
            const [model] = await this.getModel({
                [MODEL_NAME]: filters[MODEL],
                [MODEL_MARK_NAME]: filters[MARK]
            });

            if (!model.id) {
                throw new Error(`Model ${filters[MODEL]} not found`);
            }

            searchQuery[mappedForAutoBazar[MODEL]] = model.id;
        }

        [
            PRODUCTION_YEAR_FROM,
            PRODUCTION_YEAR_TO,
            PRICE_FROM,
            PRICE_TO
        ].forEach(criteria => {
            searchQuery[mappedForAutoBazar[criteria]] = filters[criteria];
        })

        const query = querystring.stringify(JSON.parse(JSON.stringify(searchQuery)));

        return query;
    }

    async buildSearchURL (filters) {
        const queryString = await this.applyFilters(filters);

        return `https://ab.ua/api/_posts/?currency=usd&${queryString}&omit=options,description,vin,cooling,categories_width,categories_height,brake_rear,brake_front,range_type,contact_name,fueltank_capacity,flowrate,dimension_width,dimension_length,dimension_weight,bucket_count,condition,cabin,brakes,suspension,chassis_suspension,cabin_suspension,date_overhaul,gears,migrated,features,engine_features,color_features,gas_equipment,views_count,caterpillars_width,gearbox_with_dividers,is_bdf,crane_arm,palets,tacts,engine_order,unloading,tonnage,accessibility,productivity,dimension_height,capacity_body,capacity_bucket,laying_width,lift_height,admission_height,arm_boom,dep_big,axises,fueltanks_count,fueltanks_capacity,couchettes`;
    }
}

const instance = new AutoBazar();

module.exports = instance;
