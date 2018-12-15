const pupp = require('puppeteer');
const fs = require('fs');
const url = 'https://dribbble.com/shots';
const d = new Date;

pupp.launch()
.then(browser => {
    return browser.newPage();
}).then(page => { 
    return page.goto(url).then(() => {
        return page.$$eval('.dribbbles > li', nodes => {
            return nodes.map(shot => {
                return {
                    author: shot.querySelector('a[rel=contact]').textContent,
                    title: shot.querySelector('strong').innerHTML,
                    img: shot.querySelector('picture > img').getAttribute('src'),
                }
        })
        });
    })
}).then(shots => {
    fs.writeFile(`dribbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots), (err) => {
        console.log(err || 'Success');
    })
})
.catch(err => console.log("Error: ", err))