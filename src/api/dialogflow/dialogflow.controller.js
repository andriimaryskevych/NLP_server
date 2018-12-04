'use strict';

exports.message = (req, res) => {
    console.log('Incomming Dialogflow request');
    res.send('OK');
};
