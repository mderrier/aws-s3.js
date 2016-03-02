'use strict';

const workerFarm = require('worker-farm');

const workers = workerFarm(require.resolve('./utils/fs-map-child'));

function s3ContentsToMap (contents) {
  const map = new Map();
  contents.forEach((entry) => {
    map.set(entry.Key, entry);
  });
  return Promise.resolve(map);
}

function fsFilesToMap (fs, cwd, filePaths) {
  const map = new Map();

  return new Promise((resolve, reject) => {
    for (let f = 0; f < filePaths.length; f += 1) {
      let filePath = filePaths[f];
      workers({ cwd, filePath }, (err, output) => {
        if (err) {
          reject(err);
          return;
        }
        if (typeof output.LastModified === 'string') {
          output.LastModified = new Date(output.LastModified);
        }
        map.set(filePath, output);
        if (map.size >= filePaths.length) {
          resolve(map);
        }
      });
    }
  });
}

module.exports = { fsFilesToMap, s3ContentsToMap };
