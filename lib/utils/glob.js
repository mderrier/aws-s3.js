'use strict';

const glob = require('glob');

function globp (pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(matches);
    });
  });
}

module.exports = { glob: globp };
