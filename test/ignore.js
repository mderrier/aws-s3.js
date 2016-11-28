/* @flow */
'use strict';

const path = require('path');

const test = require('ava');

const util = require('../lib/utils/ignore.js');

test('DEFAULT_IGNORE string array include node_modules', t => {
	t.true(Array.isArray(util.DEFAULT_IGNORE));
	t.true(util.DEFAULT_IGNORE.indexOf('node_modules') !== -1);
});

test('readBlinkmIgnore() returns an array', t => {
	return util.readBlinkmIgnore()
    .then(blinkmIgnore => t.true(Array.isArray(blinkmIgnore)));
});

test('readBlinkmIgnore() in "test/fixtures"', t => {
	return util.readBlinkmIgnore(path.join(__dirname, 'fixtures'))
    .then(blinkmIgnore => {
	t.true(Array.isArray(blinkmIgnore));
	t.deepEqual(blinkmIgnore, ['ignore-this-file.txt']);
});
});
