#!/usr/bin/env node

import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promises } from "node:fs";

const { writeFile } = promises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = await esbuild.build({
  entryPoints: [path.resolve(__dirname, "../index.js")],
  bundle: false,
  minify: true,
  write: false,
  outfile: "out.js",
  target: ["chrome58", "firefox57", "safari11", "edge16"],
  format: "iife",
  charset: "utf8",
});

const text = new TextDecoder().decode(result.outputFiles[0].contents);
const output = `javascript:${encodeURIComponent(text.trim())}`;

const page = `
<!DOCTYPE html>
<html>
  <style>
    body { font-style: sans-serif } 
  </style>
</html>
<body>
<a href="${output}">RSS Links</a>
Drag and drop the link it to the bookmars toolbar
</body>
`;

const html = path.resolve(__dirname, "../bookmarklet.html");
await writeFile(html, page);

const readme = `
# RSS Bookmarklet

Inject a small div on top of the pages with the list of RSS feed published on the page. Drag and drop the link it to the bookmars toolbar

[RSS Links](${output})

To create a new version run:

\`\`\`bash
npm install
bin/create.mjs
\`\`\` 
`;

const md = path.resolve(__dirname, "../README.md");
await writeFile(md, readme);
