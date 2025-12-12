import FS from "fs";
import Path from "path";

import parse from "../index";

const name = "real-article-0";
const articleFile = `./source/${name}.html`;
const urlFile = `./source/${name}.txt`;

const articlePath = Path.join(__dirname, articleFile);
const urlPath = Path.join(__dirname, urlFile);

const article = FS.readFileSync(articlePath, { encoding: "utf-8" });
const url = FS.readFileSync(urlPath, { encoding: "utf-8" }).trim();

const clean = parse(article, { url: url, includeTags: ["header"] });

console.log(clean);
