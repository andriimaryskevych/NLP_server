'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');

const DIALOGFLOW_ENTITIES = {
    MODEL: 'car_model',
    MARK: 'car_mark',
    PRICE_TO: 'number',
    PRICE_FROM: 'number-integer'
}

const close = agent => {
    const params = agent.contexts[0].parameters;

    const res = {};

    Object.entries(DIALOGFLOW_ENTITIES).forEach(([key, value]) => {
        res[key] = params[value];
    });

    console.log(res);

    agent.add(`Welcome to Express.JS webhook!`);
};

exports.message = (req, res) => {
    console.log('Incomming Dialogflow request');
    console.log(req.body);

    const agent = new WebhookClient({request: req, response: res});

    let intentMap = new Map();
    intentMap.set('apply_filters', close);

    agent.handleRequest(intentMap);
};
