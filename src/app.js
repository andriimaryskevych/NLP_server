/**
 * Main application file
 */

'use strict';

const express = require('express'),
    app = express();

require('./middlewares')(app);
require('./routes')(app);

exports = module.exports = app;