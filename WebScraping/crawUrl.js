const rp = require('request-promise');
const $ = require('cheerio');

const crawAtchUrl = function(title, url) {
    console.log(`Crawling ${title}' src...`);
    return rp(url).then(res => {
        const imgSrc = $('.main-shot img', res).attr('src');
        const videoSrc = $('.main-shot video', res).attr('src');
        return videoSrc || imgSrc;
    }).catch(err => console.log('error: ', err))
}

module.exports = crawAtchUrl;