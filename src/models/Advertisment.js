'use strict';

class Advertisment {
    constructor (name, image, price, adId, carStore) {
        Object.assign(this, {
            name,
            image,
            price,
            adId,
            carStore
        });
    }
};

module.exports = Advertisment;