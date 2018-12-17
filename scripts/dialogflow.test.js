const dialogflow = require('dialogflow');
const uuid = require('uuid');

require('dotenv').config({ path: 'variables.env' });

const config = {
    credentials: {
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
    },
};

(async function runSample(projectId = 'name-age-poll') {
    const sessionId = uuid.v4();

    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    console.log(sessionPath);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: 'hi',
                languageCode: 'en-US',
            },
        },
    };

    let responses;

    try {
        responses = await sessionClient.detectIntent(request);
    } catch (err) {
        console.log(err);
    }
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
})();
