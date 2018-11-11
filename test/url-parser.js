
const assert = require('assert');
const parser = require('../scripts/url-parser');


let url = parser.merge('https://www.example.com/directory/', 'file.txt');

assert.strictEqual(url, 'https://www.example.com/directory/file.txt');