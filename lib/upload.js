'use strict';

const EventEmitter = require('events');
const fs = require('fs');

const S3_METHODS = ['listObjects', 'upload'];

function assertS3 (options) {
  const s3 = options.s3;
  if (!s3 || typeof s3 !== 'object') {
    throw new TypeError('"s3" object must be provided');
  }
  S3_METHODS.forEach((method) => {
    if (typeof s3[method] !== 'function') {
      throw new TypeError(`provided "s3" object missing "${method}" method`);
    }
  });
  return options;
}

function mergeDefaults (options) {
  options = options || {};

  return Object.assign({}, {
    cwd: process.cwd(),
    dryRun: false,
    filePaths: null,
    fs,
    prune: false,
    s3: null
  }, options);
}

function upload (options) {
  options = mergeDefaults(options);
  assertS3(options);

  const task = Object.create(EventEmitter.prototype, {});
  task.promise = Promise.resolve();

  return task;
}

module.exports = { upload };
