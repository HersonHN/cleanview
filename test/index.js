
const FS = require('fs');
const Path = require('path');

const parse = require('../index');

let file = './source/real-article2.html';
let path = Path.join(__dirname, file);

let raw = FS.readFileSync(path, { encoding: 'utf-8' });
let clean = parse(raw);

console.log(clean);
