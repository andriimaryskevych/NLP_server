'use strict';

const {
    DialogFlow
} = require('../../services/DialogFlow');

exports.handleUserMessage = (req, res) => {
    DialogFlow
        .detectIntent(req.body.message)
        .then(response => {
            res.send(response);
        });
};
