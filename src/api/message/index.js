'use strict';

const controller = require('./message.controller'),
    router = require('express').Router();

router.post('/', controller.handleUserMessage);

module.exports = router;
