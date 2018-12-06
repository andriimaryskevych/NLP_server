/**
 * Main application routes
 */

'use strict';

module.exports = app => {
    app.use(['/api/ping'], require('../api/ping'));
    app.use(['/api/dialogflow'], require('../api/dialogflow'));
    app.use(['/api/message'], require('../api/message'));
};
