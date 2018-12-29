const rp = require('request-promise');
const $ = require('cheerio');

const getImgUrl = function(title, url) {
    console.log(`Getting ${title} src...`);
    return rp(url).then(res => {
        const imgSrc = $('.main-shot img', res).attr('src');
        const videoSrc = $('.main-shot video', res).attr('src');
        return videoSrc || imgSrc;
    }).catch(err => console.log('error: ', err))
}
// const pupp = require('puppeteer');

// const getImgUrl = function(url) {
//     return pupp.launch().then(browser => {
//         return browser.newPage();
//     }).then(page => {
//         return page.goto(url).then(async () => {
//             return await page.$eval('.main-shot img', img => img.src);
//         })
//     }).catch(err => console.log(err));
// }

module.exports = getImgUrl;