const del = require('del');
const path = require('path');

var deleteRules = (folder, exceptionList = []) => {
  let ex = [];
  ex.push(path.join(folder, '**'));
  ex.push('!' + folder);
  

  for (var i = 0, len = exceptionList.length; i < len; i++) {
    ex.push(path.join('!' + folder, exceptionList[i]));
  }

  return ex;
};

const clearFolder = (folder, exceptionList = []) => {
    del.sync(deleteRules(folder, exceptionList));
};

module.exports = clearFolder;
