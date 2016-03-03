'use strict';

const workerFarm = require('worker-farm');

const workers = workerFarm(require.resolve('./utils/fs-map-child'));

function fromS3Contents (contents) {
  const map = new Map();
  contents.forEach((entry) => {
    map.set(entry.Key, entry);
  });
  return Promise.resolve(map);
}

function fromFiles (fs, cwd, filePaths) {
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

function isEqual (file, object) {
  return file.Size !== object.Size || `"${file.ETag}"` !== object.ETag;
}

function compare (files, objects) {
  const deletes = [];
  const noops = [];
  const uploads = [];

  for (let key of files.keys()) {
    let file = files.get(key);
    let object = objects.get(key);
    if (!object || !isEqual(file, object)) {
      uploads.push(key);
    } else {
      noops.push(key);
    }
  }

  for (let key of objects.keys()) {
    if (!files.has(key)) {
      deletes.push(key);
    }
  }

  return { deletes, noops, uploads };
}

module.exports = {
  compare,
  fromFiles,
  fromS3Contents,
  isEqual
};
