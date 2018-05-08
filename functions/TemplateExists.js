const fs = require('fs-extra');

var templateExists = path => {
    return fs.existsSync(path);
};

module.exports = templateExists;
