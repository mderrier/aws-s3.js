'use strict';

const path = require('path');
const fs = require('fs')
const pAll = require('p-all')

// uploadObject (task: Task, fileName: String) => Promise
function uploadObject(task, fileName) {
	const cwd = task.cwd;
  // lookup details in our local files Map
	let meta;
	try {
		meta = task.files.get(fileName);
	} catch (err) {
		const error = new Error('metadata for ' + fileName + ' unavailable');
		task.emit('error', error, fileName);
		return Promise.reject(error);
	}
    // make request to AWS S3
	var p = task.s3.putObject({
		Body: fs.createReadStream(path.join(cwd, fileName)),
		ContentType: meta.ContentType,
		Key: fileName,
		ACL: task.ACL
	}).promise()
	
    return p.then(() => {
	   task.emit('uploaded', fileName);
    })
    .catch(err => {
	     task.emit('error', err, fileName);
	   throw err;
    });
}

module.exports = {
	uploadObject,
    // uploadObjects (task: Task, fileList: String[]) => Promise
	uploadObjects(task, fileList) {
		return pAll(fileList.map(fileName => () => uploadObject(task, fileName)), {concurrency: 50});
	}
};
