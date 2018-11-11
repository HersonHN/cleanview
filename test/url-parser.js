
const assert = require('assert');
const parser = require('../scripts/url-parser');



assert.strictEqual(parser.merge('https://www.example.com/directory/', 'file.txt'), 'https://www.example.com/directory/file.txt');
assert.strictEqual(parser.merge('https://www.example.com/', 'file.txt'), 'https://www.example.com/file.txt');
assert.strictEqual(parser.merge('https://www.example.com/index.html', 'file.txt'), 'https://www.example.com/file.txt');