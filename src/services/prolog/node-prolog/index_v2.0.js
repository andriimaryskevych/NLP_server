'use strict';

const {
    State
} = require('./lib/state');

const {
    DeferredPromise
} = require('./lib/deferred-promise');

const {
    logger
} = require('./lib/logger');

class Engine {
    constructor () {
        this.queryQueue = [];

        this.state = new State();
    }

    _handleNewQuery (deferredPromise) {
        const { query } = deferredPromise;

        logger.log('Handling incomnig query', query);

        if (this.queryQueue.length === 0 && this.state.isWaiting()) {
            logger.log('Immidiatelly invoking', query);

            // Resolve query executor
        } else {
            logger.log('Adding to queue', query);

            this.queryQueue.push(deferredPromise);
        }
    }

    call () {}

    async createQuery (query) {
        logger.log('Incomming query request', query);

        const payload = {
            query
        };

        let deferredPromise;

        const promise = new Promise((resolve, reject) => {
            deferredPromise = new DeferredPromise(resolve, reject, payload);
        });

        this._handleNewQuery(deferredPromise);

        return promise;
    }
}


