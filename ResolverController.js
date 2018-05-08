const fs = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const ejs = require('ejs');

const MessageProvider = require('./MessageProvider');
const Constants = require('./Constants');
const Resolver = require('./Resolver');
var Logger = require('./Logger');
var PathResolver = require('./PathResolver');
const InstructionCopyTpl = require('./InstructionCopyTpl');

class ControllerResolver extends Resolver {

  constructor(){
    super();
    this._stubTemplate = null;
    this.instructions = [];    
  }

  resolveName(options = { fileName: null, extension : null }) {

    let controllerSuffix =
      this._file.suffix || Constants.General.DIRECTIVE_CONTROLLER_SUFFIX;

    return PathResolver.destinationPath(
      this._file.targetPath,
      options.fileName + controllerSuffix + '.' + options.extension
    );

  }


  resolveItem( item ) {

    Logger.log(MessageProvider.values.DEBUGGER_RESOLVECONTROLLER + ': ' + item);

    let stub = null;
    let stubs = [];
    let data = null;

    let extension = PathResolver.getExtension(this._file.name);
    let fileFrom = path.join(this._project.source, this._file.name);
    let fileTo = this.resolveName({ fileName: item, extension: extension });

    let paths = lodash.filter(this._project.schema.paths, x => x.schema === item);

    if (this._file.stubFile && this._stubTemplate) {

      paths.forEach(path => {
        stub = ejs.render(this._stubTemplate,  {  path: path  });
        stubs.push(stub);
      });

    }

    data = {  schema: this._project.schema, paths: stubs, model: item  };

    this.instructions.push(new InstructionCopyTpl( 
                          fileFrom, 
                          fileTo, 
                          data) );   
    
  }

  _resolveStub(){

    /* extracts the stub Template from the stub File */

    let pathTemplateFile = null;

    if (this._file.stubFile) {
      pathTemplateFile = path.join(this._project.source, this._file.stubFile);
      return fs.readFileSync(pathTemplateFile).toString();
    } else 
      return null;
    

  }
  


  resolve() {

    super.resolve();
   
   
    let fileFrom = path.join(this._project.source, this._file.name);
    let fileTo = path.join(this._project.target, this._file.name);
    let paths = null;
    let stubs = [];

    Logger.log(MessageProvider.values.DEBUGGER_RESOLVECONTROLLERS + ': ' + fileTo);

    /* extracts the stubTemplate from the stubFile */
    this._stubTemplate = this._resolveStub();

    Object.keys(this._project.schema.appmodel.definitions).forEach(model => {
      this.resolveItem( model );      
    });

    return this.instructions || [];

  }

 

}

module.exports = ControllerResolver;
