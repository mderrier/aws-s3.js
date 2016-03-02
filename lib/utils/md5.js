'use strict';

const crypto = require('crypto');

function md5stream (rs) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    rs.on('error', (err) => {
      rs.unpipe();
      hash.end();
      reject(err);
    });
    rs.on('end', () => {
      hash.end();
      resolve(hash.read());
    });
    rs.pipe(hash);
  });
}

module.exports = { md5stream };
