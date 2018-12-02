'use strict';

const controller = require('./ping.controller'),
    router = require('express').Router();

router.get('/', controller.ping);

module.exports = router;
