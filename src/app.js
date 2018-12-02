/**
 * Main application file
 */

'use strict';

const express = require('express'),
    app = express();

require('./routes')(app);
require('./middlewares')(app);

exports = module.exports = app;