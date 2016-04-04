'use strict';

const fs = require('fs');
const path = require('path');

function uploadObject (task, fileName) {
  const cwd = task.cwd;
  let stream = fs.createReadStream(path.join(cwd, fileName));
  task.emit('uploading', fileName);
  let meta;

  try {
    meta = task.files.get(fileName);
  } catch (err) {
    const error = new Error('metadata for ' + fileName + ' unavailable');
    task.emit('error', error, fileName);
    return Promise.reject(error);
  }

  return new Promise((resolve, reject) => {
    task.s3.upload({
      Body: stream,
      ContentType: meta.ContentType,
      Key: fileName
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
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
