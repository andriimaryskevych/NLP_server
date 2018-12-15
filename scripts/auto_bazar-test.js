const AutoBazar = require('../src/services/AutoRia');

AutoBazar.getMark({
    "MarkName": 'Daewoo'
}).then(data => console.log(data));

setTimeout(() => {
    AutoBazar.getModel({
        "MarkName": 'Daewoo'
    }).then(data => console.log(data));
}, 1000)

AutoBazar.getMark({
    "MarkName": 'Daewoo'
}).then(data => console.log(data));

AutoBazar.getModel({
    "ID": '45sfsfsd'
}).then(data => console.log(data));
