const AutoBazar = require('../src/services/AutoBazar');

AutoBazar.getAllModelsByMark('Daewoo').then(res => console.log(res));