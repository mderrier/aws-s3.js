/* @flow */
'use strict';

const fs = require('fs');
const path = require('path');

const pify = require('pify');

const DEFAULT_IGNORE = require('ignore-by-default').directories();

function readBlinkmIgnore (
  cwd /* : ?string */
) /* : Promise<string[]> */ {
  cwd = cwd || process.cwd();
  const blinkmIgnore = path.join(cwd, '.blinkmignore');
  return pify(fs.readFile)(blinkmIgnore, 'utf8')
    .catch(() => '') // default to empty file
    .then((contents) => {
      return contents.split('\n')
        .map((line) => line.trim())
        .filter((line) => line && line[0] !== '#');
    });
}

function getGlobIgnore (
  cwd /* : ?string */
) /* : Promise<string[]> */ {
  return readBlinkmIgnore(cwd)
    .then((blinkmIgnore) => DEFAULT_IGNORE.concat(blinkmIgnore))
    .then((ignores) => Array.from(new Set(ignores))); // unique
}

module.exports = {
  DEFAULT_IGNORE,
  getGlobIgnore,
  readBlinkmIgnore
};
