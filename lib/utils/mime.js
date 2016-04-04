'use strict';

const fileType = require('file-type');
const readChunk = require('read-chunk');
const mime = require('mime-types');
const pify = require('pify');

const readChunkp = pify(readChunk);

const GENERIC_TYPES = [ 'application/octet-stream', 'text/plain' ];

function fallback (magic, filePath) {
  if (!magic || !magic.mime) {
    return mime.lookup(filePath) || 'application/octet-stream';
  }
  if (GENERIC_TYPES.indexOf(magic.mime) !== -1) {
    return mime.lookup(filePath) || magic.mime;
  }
  return magic.mime;
}

function mimeType (filePath) {
  return readChunkp(filePath, 0, 262)
    .then((buffer) => fileType(buffer))
    .then((magic) => fallback(magic, filePath));
}

module.exports = { mimeType };
