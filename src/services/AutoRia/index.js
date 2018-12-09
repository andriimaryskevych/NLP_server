'use strict';

const prolog = require('../prolog');
const constants = require('../../constants');

const { AUTO_RIA } = constants.CAR_STORE;
const { MAKE } = constants.PROLOG.PREDICATES;

class AutoRia {
    constructor() {}

    getAllMarks () {
        return new Promise((resolve, reject) => {
            const query = new prolog.Query(`${MAKE}('${AUTO_RIA}', , X, _)`);

            let ret = null;

            while (ret = query.next()) {
                console.log(`${ret.Store} has BMW ${ret.X}`);
            }
        })
    }
}

const instance = new AutoRia();

module.exports = instance;
