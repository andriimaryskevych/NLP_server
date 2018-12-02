/**
 * Main application routes
 */

'use strict';

module.exports = app => {
    app.use(['/api/ping'], require('../api/ping'));
};
