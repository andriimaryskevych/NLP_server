const AutoRia = require('../src/services/AutoBazar');

const {
    MARK,
    MODEL,
    PRODUCTION_YEAR_FROM,
    PRODUCTION_YEAR_TO,
    PRICE_FROM,
    PRICE_TO
} = require('../src/constants').SEARCH_FILTER;

setInterval(() => {
    AutoRia.buildSearchURL({
        [MARK]: 'Skoda',
        [PRODUCTION_YEAR_TO]: 1998
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err);
    });
}, 1000);
