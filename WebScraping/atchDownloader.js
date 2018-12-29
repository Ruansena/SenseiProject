const r = require('request');
const fs = require('fs');

const saveAtchInFolder = function(path, url, title) {
    console.log(`Saving ${title} image...`)
    r.get(url).pipe(fs.createWriteStream(path));
}

module.exports = saveAtchInFolder;