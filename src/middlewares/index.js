/**
 * Main application midddlewares
 */

'use strict';

module.exports = app => {
    app.use('*', (req, res, next) => {
        next();
    });
};
