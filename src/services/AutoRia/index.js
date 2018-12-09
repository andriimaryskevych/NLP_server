'use strict';

const prolog = require('../prolog');
const constants = require('../../constants');

const { AUTO_RIA } = constants.CAR_STORE;

class AutoRia {
    constructor() {}

    getAllMarks () {
        return prolog.getAllMarks(AUTO_RIA);
    }

    getAllModelsByMark (mark) {
        return prolog.getAllModelsByMark(AUTO_RIA, mark);
    }
}

const instance = new AutoRia();

module.exports = instance;
