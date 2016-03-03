'use strict';

const path = require('path');

const test = require('ava');

const maps = require('../lib/maps');

test('fromFiles', (t) => {
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
  return maps.fromFiles(null, cwd, filePaths)
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
  return maps.fromFiles(null, cwd, filePaths)
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
  return maps.fromS3Contents(contents)
    .then((map) => {
      t.same(contents[0], map.get(contents[0].Key));
    });
});

test('compareMaps', (t) => {
  const cwd = path.join(__dirname, 'fixtures');
  const filePaths = [
    'abc.txt',
    'sub/sub/index.html'
  ];
  return maps.fromFiles(null, cwd, filePaths)
    .then((files) => {
      let objects = new Map();
      objects.set('abc.txt', files.get('abc.txt'));
      objects.set('sub/extra.txt', {
        Key: 'sub/extra.txt',
        ETag: '29d7eff89d56ebba1c0fa56059c78c390e4a5f81',
        Size: 112
      });

      const results = maps.compare(files, objects);
      t.same(results.deletes, ['sub/extra.txt']);
      t.same(results.noops, ['abc.txt']);
      t.same(results.uploads, ['sub/sub/index.html']);
    });
});
