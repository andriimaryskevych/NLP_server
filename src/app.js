/**
 * Main application file
 */

'use strict';

const http = require('http'),
    express = require('express'),
    app = express();

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
