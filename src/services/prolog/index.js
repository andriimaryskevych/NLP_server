'use strict';

const prolog = require('./node-prolog');

const AccessLayer = require('./access_layer');

const instance = new AccessLayer(prolog);

module.exports = instance;
