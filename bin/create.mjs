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

const out = path.resolve(__dirname, "../bookmarklet.html");
await writeFile(out, page);
