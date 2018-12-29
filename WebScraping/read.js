const fs = require('fs');
const d = new Date;

fs.readFile(`dribbbleShots${d.getMonth()}-${d.getDate()}.json`, (err, data) => {
    console.log(JSON.parse(data) || err);
})