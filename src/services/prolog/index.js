'use strict';

const prolog = require('swipl-stdio');

const AccessLayer = require('./access_layer');

const instance = new AccessLayer(prolog);

module.exports = instance;
