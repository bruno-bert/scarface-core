const fs = require('fs-extra');

const renameFile = (oldFile, newFile) => {
  fs.renameSync(oldFile, newFile);
};

module.exports = renameFile;
