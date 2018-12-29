const pupp = require('puppeteer');
const fs = require('fs');
const mainUrl = 'https://dribbble.com';
const url = 'https://dribbble.com/shots';
const crawAtchUrl = require('./crawUrl');
const downloadAtch = require('./atchDownloader');
const d = new Date;

function makeFolder(dir) {
    if(!fs.existsSync(dir)) fs.mkdirSync(dir) //Somente se não exisitir a pasta
    return dir;
}

function writeData(name, data, folder) {
    if (folder) {
        makeFolder(folder);
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

console.log('Fetching shots from dribbble...')
pupp.launch()
.then(browser => browser.newPage())
.then(page => { 
    return page.goto(url).then(() => {
        return page.$$eval('.dribbbles > li', nodes => { //pega todos nós de shots
            return nodes.map(shot => { //mapeia os dados de cada shot
                let href = shot.querySelector('.dribbble-link').getAttribute('href');
                let AtchHref = shot.querySelector('.dribbble-link img').getAttribute('src');
                AtchHref = `${AtchHref.slice(0, AtchHref.lastIndexOf('_'))}${AtchHref.slice(AtchHref.lastIndexOf('.'))}`;
                return {
                    author: shot.querySelector('a[rel=contact]').textContent.trim(),
                    title: shot.querySelector('strong').innerHTML,
                    href,
                    AtchName: AtchHref.slice(AtchHref.lastIndexOf('/')+1),
                    AtchSrc: `./${AtchHref.slice(AtchHref.lastIndexOf('/')+1)}`,
                    AtchHref,
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
// .then(async shots => { //Acessa página do shot e guarda src do attachment (Futuramente para salvar todos attachments do shot)
//     return await shots.map(async shot => {
//         await crawAtchUrl(shot.title, `${mainUrl}${shot.href}`)
//             .then(result => {
//                 shot.AtchHref = result;
//                 shot.AtchSrc = `./${shot.AtchName}${result.slice(result.lastIndexOf('.'))}`
//             }
//         )
//     })
    // return Promise.all(
    //     shots.forEach(async shot => {
    //         await crawAtchUrl(shot.title, `${mainUrl}${shot.href}`)
    //             .then(result => {
    //                 shot.AtchHref = result;
    //                 shot.AtchSrc = `./${shot.AtchName}${result.slice(result.lastIndexOf('.'))}`
    //             }
    //         )
    //     })
    // );
// })
.then(shots => { //Acessa o attachment principal e salva
        Promise.all(
            shots.forEach(async shot => {
                await downloadAtch(`./${makeFolder(shot.author)}/${shot.AtchName}`, shot.AtchHref, shot.title);
            })
        )
})
// .then(shots => { //Atualiza os dados, futuramente para salvar mais de um attachment
//     console.log('Rewriting shots data');
//     writeData(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, JSON.stringify(shots, undefined, 2), `./${'DailyShots'}`);
// })
.catch(err => console.log("Error: ", err))