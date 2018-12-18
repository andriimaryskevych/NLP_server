'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');
const constants = require('../../constants');

const AutoRia = require('../../services/AutoRia');
const AutoBazar = require('../../services/AutoBazar');

const {
    MARK,
    MODEL,
    PRICE_FROM,
    PRICE_TO
} = constants.SEARCH_FILTER;

const {
    LINKS
} = constants.RESPONSE_TYPE;

const {
    AUTO_RIA,
    AUTOBAZAR
} = constants.CAR_STORE

const DIALOGFLOW_ENTITIES = {
    [MODEL]: 'car_model',
    [MARK]: 'car_mark',
    [PRICE_FROM]: 'number-integer',
    [PRICE_TO]: 'number'
};

const close = async agent => {
    const params = agent.contexts[0].parameters || {};

    const searchQuery = {};

    Object.entries(DIALOGFLOW_ENTITIES).forEach(([key, value]) => {
        if (params[value]) {
            searchQuery[key] = params[value];
        }
    });

    try {
        console.log(searchQuery);

        const response = {
            type: LINKS,
            payload: {}
        };

        try {
            const linkAB = await AutoBazar.buildSearchURL(searchQuery);

            response.payload[AUTOBAZAR] = {
                link: linkAB,
                status: 200
            }
        } catch (err) {
            response.payload[AUTOBAZAR] = {
                link: '',
                status: 400
            }
        }

        try {
            const linkRIA = await AutoRia.buildSearchURL(searchQuery);

            response.payload[AUTO_RIA] = {
                link: linkRIA,
                status: 200
            }
        } catch (err) {
            response.payload[AUTO_RIA] = {
                link: '',
                status: 400
            }
        }

        agent.add(JSON.stringify(response));
    } catch (err) {
        console.log(err)
        agent.add(`Welcome to Express.JS webhook! error occured`);
    }
};

exports.message = (req, res) => {
    console.log('Incomming Dialogflow request');
    console.log(req.body);

    const agent = new WebhookClient({request: req, response: res});

    let intentMap = new Map();
    intentMap.set('apply_filters', close);

    agent.handleRequest(intentMap);
};
