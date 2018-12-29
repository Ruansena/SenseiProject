const r = require('request');
const fs = require('fs');

const saveImg = function(title, name, url) {
    console.log(`Saving ${title} image...`)
    r(url, {encoding: 'binary'}, (err, res, body) => {
        fs.writeFile(name, body, 'binary', (error) => console.log(error || `${title} Saved as ${name}`));
    });
}

module.exports = saveImg;