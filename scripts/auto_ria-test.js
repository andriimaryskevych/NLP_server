const AutoRia = require('../src/services/AutoRia');

AutoRia.getAllModelsByMark('Daewoo').then(res => console.log(res));