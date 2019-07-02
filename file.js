const fs = require('fs');

const data = fs.readFileSync('./package.json', 'utf8');
console.log(data);