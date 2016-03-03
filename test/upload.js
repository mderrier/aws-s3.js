'use strict';

const EventEmitter = require('events');
const path = require('path');

const test = require('ava');

const upload = require('..').upload;

const mockS3 = {
  listObjects (options, callback) { callback(null, { Contents: [] }); },
  upload (options, callback) { callback(null); }
};

test('upload() missing s3 throws', (t) => {
  t.throws(() => upload(), TypeError);
});

test('upload() incomplete s3 throws', (t) => {
  t.throws(() => upload({ s3: {} }), TypeError);
});

test('upload() => EventEmitter', (t) => {
  const task = upload({ s3: mockS3 });
  t.ok(task instanceof EventEmitter);
});

test('upload().promise: Promise', (t) => {
  const task = upload({ s3: mockS3 });
  t.ok(task.promise instanceof global.Promise);
  return task.promise;
});

test('task = upload({ filePaths: [...] }); task.filePaths as provided', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const filePaths = [
    'abc.txt',
    'sub/sub/index.html'
  ];
  const task = upload({ cwd, filePaths, s3: mockS3 });
  return task.promise
    .then(() => {
      t.same(task.filePaths, filePaths);
    });
});

test('task = upload({ filePaths: null }); task.filePaths glob\'ed', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const filePaths = [
    'abc.txt',
    'sub/sub/index.html'
  ];
  const task = upload({ cwd, s3: mockS3 });
  return task.promise
    .then(() => {
      t.same(task.filePaths, filePaths);
    });
});

test('task = upload({ filePaths: null }); events', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const events = {
    'abc.txt': { uploading: false, uploaded: false },
    'sub/sub/index.html': { uploading: false, uploaded: false }
  };
  const task = upload({ cwd, s3: mockS3 });
  task.on('uploading', (fileName) => {
    events[fileName].uploading = true;
  });
  task.on('uploaded', (fileName) => {
    events[fileName].uploaded = true;
  });
  return task.promise
    .then(() => {
      t.same(events, {
        'abc.txt': { uploading: true, uploaded: true },
        'sub/sub/index.html': { uploading: true, uploaded: true }
      });
    });
});
