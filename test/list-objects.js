'use strict';

const test = require('ava');

const listObjects = require('../lib/list-objects').listObjects;

test.cb('calls AWS.S3#listObjects()', (t) => {
  const mockS3 = {
    listObjects (options, callback) {
      callback(null, { Contents: [] });
      t.end();
    }
  };
  listObjects(mockS3);
});

test('AWS.S3#listObjects() has error', (t) => {
  const mockS3 = {
    listObjects (options, callback) {
      callback(new Error('boom!'));
    }
  };
  return listObjects(mockS3)
    .then(() => t.fail('resolved'))
    .catch((err) => t.ok(err));
});
