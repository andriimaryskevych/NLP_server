const {
    Prolog
} = require('../src/services/prolog/node-prolog/lib/prolog-process');

const prolog = new Prolog();

const data = `consult('C:/Folder/Test/prolog').\n`

prolog.write(data, data => {
    console.log(data);

    prolog.write('fact(X, Y).\n', data => {
        console.log(data);
    })
})