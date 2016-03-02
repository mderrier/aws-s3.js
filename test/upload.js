'use strict';

const EventEmitter = require('events');

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
