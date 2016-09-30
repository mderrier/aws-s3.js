'use strict';

const fileType = require('file-type');
const readChunk = require('read-chunk');
const mime = require('mime-types');

// MIME types that are too vague to be useful
const GENERIC_TYPES = [ 'application/octet-stream', 'text/plain' ];

// fallback (magic?: Object, filePath: String) => String
function fallback (magic, filePath) {
  if (!magic || !magic.mime) {
    // first 262 bytes told us nothing
    // detect using filename extension
    return mime.lookup(filePath) || 'application/octet-stream';
  }
  if (GENERIC_TYPES.indexOf(magic.mime) !== -1) {
    // first 262 bytes told us nothing useful
    // detect using filename extension
    return mime.lookup(filePath) || magic.mime;
  }
  // use the result from the first 262 bytes
  return magic.mime;
}

// mimeType (filePath: String) => Promise<String>
function mimeType (filePath) {
  // detect MIME using only first 262 bytes of file
  return readChunk(filePath, 0, 262)
    .then((buffer) => fileType(buffer))
    // in case that failed, use the filename extension
    .then((magic) => fallback(magic, filePath));
}

module.exports = { mimeType };
