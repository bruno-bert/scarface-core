const GeneratorCommand = require('./GeneratorCommand');
const Constants = require('./Constants');
const clearFolder = require('./functions/ClearFolder');


class ClearFolderCommand extends GeneratorCommand{

 
    main(){
       
        if (this._project.configurator.clearTargetFolder) {
            
            this._logger.log(this._MessageProvider.values.DEBUGGER_CLEARPROJECT);

            return clearFolder(
                         this._project.target, 
                         [Constants.Files.FILE_USER_JSON]);
        }

    }

}

module.exports = ClearFolderCommand;