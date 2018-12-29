const r = require('request');
const fs = require('fs');

const saveAtchInFolder = function(author, name, url, title) {
    console.log(`Saving ${title} image...`)
    r.get(url).pipe(fs.createWriteStream(`./${author}/${name}`));
}

module.exports = saveAtchInFolder;