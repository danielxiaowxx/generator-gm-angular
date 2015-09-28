/**
 * Created by danielxiao on 15/9/28.
 */

var child_process = require('child_process');
var Promise = require('bluebird');
var logger = require('./logger');

module.exports = {
  removeFiles: removeFiles,
  exec       : exec
};

function removeFiles(context, rmFiles, folder) {

  var done = context.async();

  var files = rmFiles;
  var remove = [];

  for (var i = 0; i < files.length; i++) {
    remove.push(exec('rm ./' + folder + '/' + files[i]));
  };

  Promise.all(remove)
    .then(function() {
      done();
    })
    .catch(function(err) {
      logger.red(err);
      return;
    });

}

function exec(cmd) {
  return new Promise(function(resolve, reject) {
    child_process.exec(cmd, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
