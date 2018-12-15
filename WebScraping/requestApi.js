const r = require('request');

r.get('https://jsonplaceholder.typicode.com/posts/1', (err, res, body) => {
    console.log(JSON.parse(body));
})