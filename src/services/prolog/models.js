'use strict';

class Mark {
    constructor (store, name, id) {
        Object.assign(this, {
            store,
            name,
            id
        });
    }
};

class Model {
    constructor (store, mark, name, id) {
        Object.assign(this, {
            store,
            mark,
            name,
            id
        });
    }
};

module.exports.Mark = Mark;
module.exports.Model = Model;
