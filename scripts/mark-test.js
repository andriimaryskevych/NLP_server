const { Mark } = require('../src/models/Mark');

console.log(Mark.name);

const {
    STORE_NAME,
    MARK_NAME
} = Mark.scheme;

Mark.find({
    [STORE_NAME]: 'AUTO_RIA',
    [MARK_NAME]: 'Daewoo'
}).then(data => console.log("data"));

Mark.find({
    [STORE_NAME]: 'AUTO_RIA'
}).then(data => console.log("data"));
