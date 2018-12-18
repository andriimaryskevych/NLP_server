'use strict';

const _ = require('lodash');

const {
    DialogFlow
} = require('../../services/DialogFlow');

exports.handleUserMessage = (req, res) => {
    DialogFlow
        .detectIntent(req.body.message)
        .then(response => {
            console.log(response);
            res.send(response);
        });
};
