'use strict';

const fs = require('fs');
const path = require('path');

const pify = require('pify');

function uploadObject (task, fileName) {
  const cwd = task.cwd;
  const s3p = pify(task.s3);
  let stream = fs.createReadStream(path.join(cwd, fileName));
  task.emit('uploading', fileName);
  return s3p.upload({
    ContentMD5: task.files.get(fileName).ETag,
    Body: stream,
    Key: fileName
  })
    .then(() => {
      task.emit('uploaded', fileName);
    })
    .catch((err) => {
      task.emit('error', err, fileName);
      throw err;
    });
}

module.exports = {
  uploadObject,
  uploadObjects (task, fileList) {
    return Promise.all(fileList.map((fileName) => uploadObject(task, fileName)));
  }
};
