const path = require('path');

const Observable = require('../Observable');
const MessageProvider = require('../MessageProvider');
const PathResolver =  require('../PathResolver');

const InstructionRename =  require('../InstructionRename');
const InstructionCopy =  require('../InstructionCopy');
const InstructionCopyTpl =  require('../InstructionCopyTpl');


class BuildInstructions extends Observable {

  constructor(project) {
    super();
    this._project = project;  
  }

  _resolveName(file) {

    if (!this._project)
      throw ('_resolveName: Project cannot be null');
 
    let newName = null;
    let extension = PathResolver.getExtension(file.name);   
    let DefaultResolver = require('../Resolver');
   
    let nameResolver = file.nameResolver || new DefaultResolver();

    nameResolver.Project = this._project;
    nameResolver.File = file;

    newName = nameResolver.resolveName( { extension: extension }  );
    newName = file.targetPath ? path.join(file.targetPath, newName) : newName;

    return PathResolver.destinationPath(newName);

  }


  
  build() {
    
      let fileFrom = '';
      let fileTo = '';
      let resolver = null;
      let instructions = [];
      let instruction = null;
      let customInstructions = [];

      let source = this._project.source;
      let target = this._project.target;
      let schema = this._project.schema;
      let configurator = this._project.configurator;
      

         /* This stores all instructions in an array and returns it to main command */
         
         configurator.files.forEach( file => {

          this.notify(MessageProvider.values.DEBUGGER_TEMPLATEFILE + ': ' + file.name);

          /* Add dialect to file level */
          file.dialect = file.dialect || configurator.dialect;
          
          fileFrom = path.join(source, file.name);
          fileTo = path.join(target, file.name);

          switch (file.action) {

            case 'rename': {
              instruction = new InstructionRename(  fileTo, this._resolveName(file)  );
              instruction.subscribe(this);
              instructions.push(instruction);
              break;
            }

            case 'copy': {
              fileTo = (file.rename || file.nameResolver) ? this._resolveName(file) : fileTo;      
              instruction = new InstructionCopy( fileFrom, fileTo );
              instruction.subscribe(this);
              instructions.push(instruction);
              break;
            }

            case 'copyTpl': {
              fileTo = (file.rename || file.nameResolver) ? this._resolveName(file) : fileTo;    
              instruction = new InstructionCopyTpl( fileFrom, fileTo, {  schema: schema }  );
              instruction.subscribe(this);
              instructions.push(instruction);
              break;
            }


            case 'custom': {

              resolver = file.resolver;              
              resolver.Project = this._project;
              resolver.File = file ; 
              
              customInstructions = resolver.resolve();

              customInstructions.forEach( instruction => {
                instruction.subscribe(this);
                instructions.push(instruction);
              });
              
              break;

            }


            default: {
              break;
            }


          }

        });

        return instructions;

  }

}


module.exports = BuildInstructions;
