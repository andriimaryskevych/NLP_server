const { Mark } = require('../src/models/Mark');
const { Model } = require('../src/models/Model');

const {
    STORE_NAME,
    MARK_NAME,
    ID
} = Mark.scheme;

const one = Mark.find({
    [STORE_NAME]: 'AUTO_RIA'
});

const two = Mark.find({
    [STORE_NAME]: 'AUTO_RIA',
    [ID]: '45'
});

const three = Model.find({
})

console.log(three.length);
