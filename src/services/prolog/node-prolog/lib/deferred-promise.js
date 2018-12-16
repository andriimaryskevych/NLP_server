'use strict';

class DeferredPromise {
    constructor (resolve, reject, payload) {
        this.resolve = resolve;
        this.reject = reject;
        this.payload = payload;
    }
}

module.exports = {
    DeferredPromise
};
