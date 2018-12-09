'use strict';

const prolog = require('../prolog');
const constants = require('../../constants');

const { AUTOBAZAR } = constants.CAR_STORE;

class AutoBazar {
    constructor() {}

    getAllMarks () {
        return prolog.getAllMarks(AUTOBAZAR);
    }

    getAllModelsByMark (mark) {
        return prolog.getAllModelsByMark(AUTOBAZAR, mark);
    }
}

const instance = new AutoBazar();

module.exports = instance;
