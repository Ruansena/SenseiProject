const rp = require('request-promise');
const $ = require('cheerio');

const potusParse = function(url) {
    return rp(url).then(res => {
        return {
            name: $('.firstHeading', res).text(),
            birthday: $('.bday', res).text(),
        };
    }).catch(err => console.log('error: ', err))
}

module.exports = potusParse;