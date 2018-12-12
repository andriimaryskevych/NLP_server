const AutoBazar = require('../src/services/AutoRia');

console.log(AutoBazar.getMark({
    'MarkName': 'Dacia',
    'ID': '17'
}))

console.log(AutoBazar.getModel({
    'ID': 'Daewoo'
}))
