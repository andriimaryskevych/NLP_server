const AutoBazar = require('../src/services/AutoRia');

AutoBazar.getMark({
    "ID": '45'
}).then(data => console.log(data));

AutoBazar.getModel({
    "ID": 'sdfgd'
}).then(data => console.log(data));

// setInterval(() => {console.log('Hello')}, 10);
