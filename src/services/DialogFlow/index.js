'use strict';

const dialogflow = require('dialogflow');

const {
    PLAIN
} = require('../../constants').RESPONSE_TYPE;

const projectId = 'name-age-poll';
const sessionId = 'quickstart-session-id1';
const languageCode = 'en-US';

const config = {
    credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    },
};

class DialogFlow {
    constructor() {}

    async detectIntent(message) {
        const sessionClient = new dialogflow.SessionsClient(config);

        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: languageCode,
                },
            },
        };

        try {
            const responses = await sessionClient.detectIntent(request);

            const result = responses[0].queryResult;

            try {
                JSON.parse(result.fulfillmentText).type;

                return result.fulfillmentText;
            } catch (err) {
                console.log('error parsing data');
            }

            return JSON.stringify({
                type: PLAIN,
                payload: {
                    message: result.fulfillmentText
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}

const instace = new DialogFlow();

module.exports = {
    DialogFlow: instace
};