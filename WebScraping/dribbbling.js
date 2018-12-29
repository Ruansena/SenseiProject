const pupp = require('puppeteer');
const fs = require('fs');
const mainUrl = 'https://dribbble.com';
const url = 'https://dribbble.com/shots';
const crawAtchUrl = require('./crawUrl');
const downloadAtch = require('./atchDownloader');
const d = new Date;

function writeData(name, data, folder) {
    if (folder) {
        if(!fs.existsSync(folder)) fs.mkdir(folder) //Se não exisitir a pasta, crie
        fs.writeFile(`${folder}/${name}`, data, err => {
            console.log(err || 'Success Writing!');
        })        
    }
    else {
        fs.writeFile(name, data, err => {
            console.log(err || 'Success Writing!');
        })
    }
}

pupp.launch()
.then(browser => browser.newPage())
.then(page => { 
    return page.goto(url).then(() => {
        return page.$$eval('.dribbbles > li', nodes => { //pega todos nós de shots
            return nodes.map(shot => { //mapea os dados de cada shot
                let shotHref = shot.querySelector('.dribbble-link').getAttribute('href');
                return {
                    author: shot.querySelector('a[rel=contact]').textContent.trim(),
                    title: shot.querySelector('strong').innerHTML,
                    href: shotHref,
                    AtchName: shotHref.slice(shotHref.lastIndexOf('/')+1),
                    AtchSrc: '',
                    AtchHref: '',
                }
            })
        })
    })
})
.then(shots => { //Grava dados em json
    console.log('Writing shots data');
    writeData(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots), `./${'DailyShots'}`);
    return shots;
})
.then(shots => { //Acessa página do shot e guarda src do attachment
    Promise.all(
        shots.forEach(async shot => {
            await crawAtchUrl(shot.title, `${mainUrl}${shot.href}`)
                .then(result => {
                    shot.AtchHref = result;
                    shot.AtchSrc = `./${shot.AtchName}${result.slice(result.lastIndexOf('.'))}`
                }
            )
        })
    )
    return shots;
})
.then(shots => { //Acessa cada attachment e salva
        Promise.all(
            shots.forEach(async shot => {
                await downloadAtch(shot.author, shot.AtchName, shot.AtchHref, shot.title);
            })
        )
    return shots;
})
.then(shots => { //Atualiza os dados
    console.log('Rewriting shots data');
    writeData(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots), `./${'DailyShots'}`);
})
.catch(err => console.log("Error: ", err))