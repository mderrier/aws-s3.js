# Change Log


## 1.1.1 - 2016-03-04


### Fixed

- fix equality tests when comparing MD5 hashes

- drop ContentMD5 HTTP header for now (requires Base64, not hexadecimal)

    - consumer should use "computeChecksums" option for `new AWS.S3()`: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property


## 1.1.0 - 2016-03-03


### Added

- new "skipped" event emitted for files that are not changed


### Fixed

- pass unquoted local MD5 as ContentMD5 HTTP header

- wrap local MD5s once during comparison, instead of extra unwrap


## 1.0.1 - 2016-03-03


### Changed

- send ContentMD5 HTTP header during upload


### Fixed

- calculate MD5 instead of SHA1 (oops)

- fix `Promise`-ification of `AWS.S3#upload()`

- wrap local MD5s in quotes like real ETags

    - with other fixes, change-detection works to skip unchanged files
