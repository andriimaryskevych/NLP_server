const prolog = require('../src/services/prolog');

const query = new prolog.Query("make(_, 'BMW', Y)");

let ret = null;

while (ret = query.next()) {
    console.log(`has BMW under id ${ret.Y}`);
}
