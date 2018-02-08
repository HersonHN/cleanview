
const fs = require('fs');
const parse = require('../index');

let html = fs.readFileSync('./source/real-article1.html', { encoding: 'utf-8' });
let clean = parse(html);

console.log(clean);
