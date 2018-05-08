const GeneratorCommand = require('./GeneratorCommand');
const CopyTemplate = require('./functions/CopyTemplate');

class CopyTemplateCommand extends GeneratorCommand {

   
    execute() {

        this._logger.log(this._MessageProvider.values.DEBUGGER_COPYTEMPLATE);
        
        let runner = new CopyTemplate(
                                this._project.source,
                                this._project.target,
                                this._project.configurator.excludeFromCopy);

                runner.subscribe(this);

                runner.run();


    }


 

}

module.exports = CopyTemplateCommand;