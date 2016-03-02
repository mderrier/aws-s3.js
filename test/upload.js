'use strict';

const EventEmitter = require('events');
const path = require('path');

const test = require('ava');

const upload = require('..').upload;

const mockS3 = { listObjects () {}, upload () {} };

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
  const filePaths = [
    'abc.txt',
    'sub/sub/index.html'
  ];
  const task = upload({ filePaths, s3: mockS3 });
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
