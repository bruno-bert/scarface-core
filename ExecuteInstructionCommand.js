const GeneratorCommand = require('./GeneratorCommand');

class ExecuteInstructionCommand extends GeneratorCommand {

    execute() {

        this._logger.log(this._MessageProvider.values.DEBUGGER_EXECUTE_INSTRUCTIONS);

        if (!this._project.instructions) {
            this._logger.log(this._MessageProvider.values.DEBUGGER__NONE_INSTRUCTIONS);
            return;
        }
            

        this._project.instructions.forEach(instruction => {
            instruction.subscribe(this);
            instruction.execute();
        });

    }

}


module.exports = ExecuteInstructionCommand;