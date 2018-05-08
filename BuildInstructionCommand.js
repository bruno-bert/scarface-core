const GeneratorCommand = require('./GeneratorCommand');
const BuildInstructions = require('./functions/BuildInstructions');

class BuildInstructionCommand extends GeneratorCommand{

   
    
    execute(){        

        this._logger.log(this._MessageProvider.values.DEBUGGER_BUILD_INSTRUCTIONS);
        let builder = new BuildInstructions(this._project);         
        this._project.instructions = builder.build();       

    }

   
}


module.exports = BuildInstructionCommand;