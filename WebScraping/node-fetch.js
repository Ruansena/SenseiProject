const nf = require('node-fetch');
const url = 'https://jsonplaceholder.typicode.com/posts/1';

const getData = async url => {
    try {
        const res = await nf(url);
        const json = await res.json();
        console.log(json);
    } catch(err) {
        console.log(err);
    }
};

getData(url);