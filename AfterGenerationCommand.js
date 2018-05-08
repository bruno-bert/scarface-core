const GeneratorCommand = require('./GeneratorCommand');

class AfterGenerationCommand extends GeneratorCommand {

   
    execute() {
        this._logger.log(this._MessageProvider.values.MESSAGE_SUCCESS);
    }

}

module.exports = AfterGenerationCommand;


