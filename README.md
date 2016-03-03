# blinkmobile/aws-s3

our simplified wrapper for common AWS S3 operations

[![npm module](https://img.shields.io/npm/v/@blinkmobile/aws-s3.svg)](https://www.npmjs.com/package/@blinkmobile/aws-s3)
[![Build Status](https://travis-ci.org/blinkmobile/aws-s3.js.svg?branch=master)](https://travis-ci.org/blinkmobile/aws-s3.js)


## Getting Started

```sh
npm install @blinkmobile/aws-s3 aws-sdk
```

```js
const upload = require('@blinkmobile/aws-s3').upload;
const AWS = require('aws-sdk');
```


## Usage

```js
const task = upload({
  // common options
  cwd: '', // current working directory to search, defaults to `process.cwd()`
  prune: false, // true => delete S3 Objects that don't match local files
  s3: new AWS.S3({ /* ... */ }),

  // advanced options
  dryRun: false, // true bypasses write calls with simulated success events
  filePaths: [''], // paths relative to rootPath, defaults to glob(['**/*'])
  fs: null // defaults to `require('fs')`
});

const EventEmitter = require('events');
console.assert(task instanceof EventEmitter);
console.assert(task.promise instanceof Promise);
```

## API

```
upload (options: UploadOptions) => Task
```

```
interface Task extends EventEmitter {
  filePaths: String[],
  promise: Promise
}
```

Note: until `task.promise` resolves / rejects, other properties may not be available. `EventEmitter` methods _are_ always available.

```
interface UploadOptions {
  cwd? : String, // defaults to process.cwd()
  dryRun = false: Boolean,
  filePaths?: String[], // defaults to glob(['**/*'])
  fs? : Object, // defaults to require('fs')
  prune = false : Boolean,
  s3: AWS.S3
}
```


### Events

- **uploading**: `fileName`

- **uploaded**: `fileName`

- **error**: `error`, `fileName`

```js
const task = upload({ /* ... */ });
task.on('error', (error, fileName) => {
  // TODO: ...
});
```


## Roadmap

- [ ] implement "dryRun" option
- [ ] implement "prune" option
- [ ] implement "fs" option
- [ ] support S3 Buckets with more than 100 Objects
