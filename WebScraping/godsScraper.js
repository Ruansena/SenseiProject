const rp = require('request-promise'); 
const url = 'https://www.realmeye.com/wiki/gods';

rp.get(url).then(res => {
    console.log('RESPONSE: ', res);
}).catch(err => console.log('ERRO: ', err.statusCode));