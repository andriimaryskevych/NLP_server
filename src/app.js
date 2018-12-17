/**
 * Main application file
 */

'use strict';

const http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express();

require('dotenv').config({ path: 'variables.env'});

require('./middlewares')(app);
require('./routes')(app);


function startServer() {
    const server = http.createServer(app);

    server.listen(8080, () => {
        console.log('Server started');
    });
}

setImmediate(startServer);

exports = module.exports = app;
