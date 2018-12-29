const pupp = require('puppeteer');
const fs = require('fs');
const mainUrl = 'https://dribbble.com';
const url = 'https://dribbble.com/shots';
const getImgUri = require('./imgUriParse');
const saveImg = require('./imgBuffer');
const d = new Date;

pupp.launch()
.then(browser => browser.newPage())
.then(page => { 
    return page.goto(url).then(() => {
        return page.$$eval('.dribbbles > li', nodes => {
            return nodes.map(shot => {
                let shotHref = shot.querySelector('.dribbble-link').getAttribute('href');
                return {
                    author: shot.querySelector('a[rel=contact]').textContent.trim(),
                    title: shot.querySelector('strong').innerHTML,
                    href: shotHref,
                    imgName: shotHref.slice(shotHref.lastIndexOf('/')+1),
                    imgSrc: '',
                    imgHref: '',
                }
            })
        })
    })
})
.then(shots => { //Grava dados em json
    fs.writeFile(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots), err => {
        console.log(err || 'Success writing');
    })
    return shots;
})
.then(shots => { //Acessa página do shot e guarda src url da imagem original
        Promise.all(
            shots.forEach(async shot => {
                await getImgUri(shot.title, `${mainUrl}${shot.href}`).then(result => {
                    shot.imgHref = result;
                    shot.imgSrc = `./${shot.imgName}${result.slice(result.lastIndexOf('.'))}`;
                })
            })
        )
    return shots;
})
.then(shots => { //Acessa cada url das imagens e salva
        Promise.all(
            shots.forEach(async shot => {
                await saveImg(shot.title, shot.imgName, shot.imgHref);
            })
        )
    return shots;
})
.then(shots => { //Atualiza os dados
    fs.writeFile(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots), err => {
        console.log(err || 'Updated');
    })
})
.catch(err => console.log("Error: ", err))