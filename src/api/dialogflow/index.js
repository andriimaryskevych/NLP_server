'use strict';

const controller = require('./dialogflow.controller'),
    router = require('express').Router();

router.post('/', controller.message);

module.exports = router;
