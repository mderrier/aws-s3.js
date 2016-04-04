'use strict';

const fs = require('fs');
const path = require('path');

const pify = require('pify');

const md5stream = require('./md5').md5stream;
const mimeType = require('./mime').mimeType;

const fsp = pify(fs);

module.exports = function (input, callback) {
  const localPath = path.join(input.cwd, input.filePath);
  Promise.all([
    fsp.stat(localPath),
    md5stream(fs.createReadStream(localPath)),
    mimeType(localPath)
  ])
    .then((results) => {
      const stats = results[0];
      const md5 = results[1];
      const mime = results[2];
      callback(null, {
        ContentType: mime,
        ETag: md5,
        Key: input.filePath,
        LastModified: stats.mtime,
        Size: stats.size
      });
    })
    .catch((err) => callback(err));
};

