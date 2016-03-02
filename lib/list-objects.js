'use strict';

function listObjects (s3) {
  return new Promise((resolve, reject) => {
    s3.listObjects({}, function (err, data) {
      if (err) {
        if (!(err instanceof Error)) {
          err = new Error(err);
        }
        reject(err);
        return;
      }
      resolve(data.Contents);
    });
  });
}

module.exports = { listObjects };
