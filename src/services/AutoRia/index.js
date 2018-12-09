'use strict';

const prolog = require('../prolog');
const constants = require('../../constants');

const { AUTO_RIA } = constants.CAR_STORE;

class AutoRia {
    constructor() {}

    getAllMarks () {
        return new Promise((resolve, reject) => {
            try {
                const result = prolog.getAllMarks(AUTO_RIA);

                resolve(result);
            } catch (err) {
                reject(err);
            }
        })
    }

    getAllModelsByMark (mark) {
        return new Promise((resolve, reject) => {
            try {
                const result = prolog.getAllModelsByMark(AUTO_RIA, mark);

                resolve(result);
            } catch (err) {
                reject(err);
            }
        })
    }
}

const instance = new AutoRia();

module.exports = instance;
