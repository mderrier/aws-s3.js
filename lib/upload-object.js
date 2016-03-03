'use strict';

const fs = require('fs');
const path = require('path');

function uploadObject (s3, cwd, fileName) {
  let stream = fs.createReadStream(path.join(cwd, fileName));
  return s3.upload({ Key: fileName, Body: stream });
}

module.exports = {
  uploadObject,
  uploadObjects (s3, cwd, fileList) {
    return Promise.all(fileList.map((fileName) => uploadObject(s3, cwd, fileName)));
  }
};
