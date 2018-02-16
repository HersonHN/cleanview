
const FS = require('fs');
const Path = require('path');

const parse = require('../index');

let name = 'real-article-0';
let articleFile = `./source/${name}.html`;
let urlFile = `./source/${name}.txt`;

let articlePath = Path.join(__dirname, articleFile);
let urlPath = Path.join(__dirname, urlFile);

let article = FS.readFileSync(articlePath, { encoding: 'utf-8' });
let url = FS.readFileSync(urlPath, { encoding: 'utf-8' }).trim();

let clean = parse(article, { url: url });

console.log(clean);
