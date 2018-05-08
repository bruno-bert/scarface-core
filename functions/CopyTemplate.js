const fs = require('fs-extra');
const path = require('path');
const Observable = require('../Observable');

class CopyTemplate extends Observable {

  constructor(source, target, exceptionList = []) {
    super();
    this.source = source;
    this.target = target;
    this.exceptionList = exceptionList;
  }

  
  run(){

    let filter = file => {
      this.notify(file);
      let performCopy = this.exceptionList.indexOf(path.basename(file)) == -1;  
      return performCopy;
    };
    
     fs.copySync(this.source, this.target, { filter });
    
    
  }


}


module.exports = CopyTemplate;
