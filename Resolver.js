class Resolver {
  
    constructor(){
      this._project = null;
      this._file = null;
    }

    set Project(newProject){
      this._project = newProject;
    }

    set File(newFile){
      this._file = newFile;
    }

    
  validateRequired(){

    if (!this._project)
    throw ('Project cannot be null');

    if (!this._file)
      throw ('File cannot be null');

  }


    resolve(options) {
      this.validateRequired();
      return null;
    }
  
    resolveItem(options) {
      return null;
    }
  

    resolveName(options = {fileName: null, extension : '.js'}) {

      /* this is default implemetation used to rename files with project name */ 
      let name = options.fileName || this._project.schema.appconfig.name;
      return options.extension ? name.concat('.', options.extension) : name;
      
    }
    

  }
  
  module.exports = Resolver;
  