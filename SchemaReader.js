const fs = require('fs-extra');


class SchemaReader {

  constructor(){
  
  }

  read(file) {
    let schema = fs.readJSONSync(file,{ throws: false });
    return schema;
  }

}


module.exports =  new SchemaReader()  ;