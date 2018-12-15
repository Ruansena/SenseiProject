const pupp = require('puppeteer');
const url = 'https://reddit.com';

pupp.launch()
.then(browser => {
    return browser.newPage();
}).then(page => {
    return page.goto(url).then(()=> {
        return page.$$eval('h2', titles => titles.map(title => title.innerHTML));
    });
})
.then(titles => {
    titles.forEach(title => console.log(title));
})
.catch(err => {
    console.log('error: ', err);
});