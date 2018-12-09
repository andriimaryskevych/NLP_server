const AutoRia = require('../src/services/AutoRia');

AutoRia.getAllMarks().then(res => console.log(res));
AutoRia.getAllModelsByMark('Daewoo').then(res => console.log(res));