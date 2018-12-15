// Começamos por importar o módulo de requisição http do node.
const rp = require('request-promise'); // Requisita o resquest promise que é assyncrono e suporta promises no final
const $ = require('cheerio');
const potusParse = require('./potusParse');
// const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States'
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States'; // Referencia url

rp.get(url).then(res => {
    const length = $('big > a', res).length; // Salva quantidade presidentes
    const anchors = $('big > a', res); // Referencia as tags anchor do nome dos presidentes
    const wikiUrls = [];
    for(let i = 0; i < length; i++)
        wikiUrls.push(anchors[i].attribs.href); // Salva cara link de pagina dos presidentes
    return Promise.all( // Promete realizar todas chamadas de mapeamento assincronamente lul
        wikiUrls.map(url => {
            return potusParse('https://en.wikipedia.org' + url); // Mapea o Nome e DataNascimento retornado pela promessa do módulo potusParse
        })
    );
}).then(presidents => console.log(presidents)) // Log do valor retornado anterior
.catch(err => console.log('error: ', err.statusCode)); // Se der merda quero sabe o numero da merda