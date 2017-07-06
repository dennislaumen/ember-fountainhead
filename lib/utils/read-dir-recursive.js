'use strict';
const { readdirSync, statSync } = require('fs');
const { join, sep } = require('path');

/**
 * Recursively walk a directory adding each file to an array
 * @class readDirRecursive
 * @constructor
 * @return {Array} Array of all files in directory
 */
const walkSync = dir => {
  let fileList = [];
  let files;

  try {
    files = readdirSync(dir);
  } catch (err) { return err; }

  files.forEach(file => {
    if (statSync(join(dir, file)).isDirectory()) {
      fileList = fileList.concat(walkSync(join(dir, file)));
    } else {
      fileList.push(`${dir}${sep}${file}`);
    }
  });

  return fileList;
};

module.exports = walkSync;
