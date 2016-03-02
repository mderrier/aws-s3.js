'use strict';

const path = require('path');

const test = require('ava');

const fsFilesToMap = require('../lib/file-maps').fsFilesToMap;
const s3ContentsToMap = require('../lib/file-maps').s3ContentsToMap;

test('fsFileToMap', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const filePaths = [
    'abc.txt',
    'sub/sub/index.html'
  ];
  const expected = {
    'abc.txt': {
      Key: 'abc.txt',
      ETag: '943a702d06f34599aee1f8da8ef9f7296031d699',
      Size: 13
    },
    'sub/sub/index.html': {
      Key: 'sub/sub/index.html',
      ETag: '29d7eff89d56ebba1c0fa56059c78c390e4a5f81',
      Size: 112
    }
  };
  return fsFilesToMap(null, cwd, filePaths)
    .then((map) => filePaths.forEach((key) => {
      const entry = map.get(key);
      t.ok(entry.LastModified instanceof Date);
      delete entry.LastModified; // value is too unpredictable for this test
      t.same(map.get(key), expected[key]);
    }));
});

test('fsFileToMap with missing local file', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const filePaths = [
    'missing.txt'
  ];
  return fsFilesToMap(null, cwd, filePaths)
    .then(() => t.fail('resolved'))
    .catch((err) => t.ok(err));
});

test('s3ContentsToMap', (t) => {
  const contents = [
    {
      Key: 'abc.txt',
      LastModified: new Date(),
      ETag: 'abc',
      Size: 123
    }
  ];
  return s3ContentsToMap(contents)
    .then((map) => {
      t.same(contents[0], map.get(contents[0].Key));
    });
});
