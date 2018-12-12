'use strict';

const prolog = require('../prolog');
const constants = require('../../constants');

const { AUTO_RIA } = constants.CAR_STORE;

/**
 * To search for cars using AutoRia.com API we need to query ids, that match our filters
 * https://developers.ria.com/auto/search
 *
 * Later for each needed id, separate request will fetch all data
 * https://developers.ria.com/auto/search?auto_id={{ad id}}
 */
class AutoRia {
    constructor() {}

    getAllMarks () {
        return prolog.getAllMarks(AUTO_RIA);
    }

    getMark (mark) {
        return prolog.getAllMarks(AUTO_RIA, mark);
    }

    getAllModelsByMark (mark) {
        return prolog.getAllModelsByMark(AUTO_RIA, mark);
    }
}

const instance = new AutoRia();

module.exports = instance;
