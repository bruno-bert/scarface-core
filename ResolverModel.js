const fs = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const ejs = require('ejs');

const MessageProvider = require('./MessageProvider');
const Resolver = require('./Resolver');
const InstructionCopyTpl = require('./InstructionCopyTpl');

var Logger = require('./Logger');
var PathResolver = require('./PathResolver');


class ModelResolver extends Resolver {

  constructor(){
    super();    
    this.instructions = [];
  }

  resolveName(options = { fileName: null, extension : null }) {  

    return PathResolver.destinationPath(
      this._file.targetPath, 
       options.fileName + '.' + options.extension);

  }

  resolveItem( item ) {

    Logger.log( MessageProvider.values.DEBUGGER_CREATEMODEL + ': ' + item.name  );
   
    let fileFrom = path.join(this._project.source, this._file.name);
    let extension = PathResolver.getExtension(this._file.name);
    let fileTo = this.resolveName( 
      { fileName: item.name, 
        extension : extension } );    
 
    let data = { schema : this._project.schema, model : item  } ;

    this.instructions.push(new InstructionCopyTpl( 
      fileFrom, 
      fileTo, 
      data) );   

  }

  _resolveModels(schema, dialect, modelPath) {

    const js2model = require('./js2model');
    let modelOptions = new js2model.Options();

    modelOptions.dialect = dialect;
    modelOptions.projectName = schema.appconfig.name;
    modelOptions.destinationFolderPath = modelPath;

    js2model.convert(schema.appmodel, modelOptions);

    return modelOptions.dialect.models;
  }


  resolve() {

    super.resolve();

    let targetPath = PathResolver.destinationPath(this._file.targetPath);
    let models = null;

    Logger.log(  MessageProvider.values.DEBUGGER_CREATEMODELS );

    models = this._resolveModels(
      this._project.schema,  this._file.dialect, targetPath
    );

    models.forEach(model => {
      this.resolveItem( model );      
    });

    return this.instructions || [];

  }


}

module.exports = ModelResolver;
