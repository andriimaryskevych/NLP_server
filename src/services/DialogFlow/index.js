'use strict';

const dialogflow = require('dialogflow');

const projectId = 'name-age-poll';
const sessionId = 'quickstart-session-id';
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

            console.log('Detected intent');

            const result = responses[0].queryResult;
            return result.fulfillmentText;
        } catch (err) {
            console.log(err);
        }
    }
}

const instace = new DialogFlow();

module.exports = {
    DialogFlow: instace
};