'use strict';

const Advertisment = require('./Advertisment');

class RichAdvertisment extends Advertisment {
    constructor (name, image, price, adId, carStore, description) {
        super(name, image, price, adId, carStore);

        Object.assign(this, {
            description
        });
    }
};

module.exports = RichAdvertisment;
