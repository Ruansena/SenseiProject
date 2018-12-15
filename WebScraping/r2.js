const r2 = require('r2');
const url = 'https://jsonplaceholder.typicode.com/posts/1';

const getData = async url => {
    try {
        const res = await r2(url).json;
        console.log(res);
    } catch(err) {
        console.log(err);
    }
};

getData(url);