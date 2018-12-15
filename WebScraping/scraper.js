// Começamos por importar o módulo de requisição http do node.
const rp = require('request-promise'); // Requisita o resquest promise que é assyncrono e suporta promises no final
// const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States'
const url = 'https://jsonplaceholder.typicode.com/posts/1'; // Referencia url

rp.get(url).then(res => console.log(JSON.parse(res))).catch(err => console.log(err)); // Requisição básica do corpo da página da url