const GeneratorCommand = require('./GeneratorCommand');
const templateExists = require('./functions/TemplateExists');

class CheckTemplateCommand extends GeneratorCommand {

   

    execute() {

        this._logger.log(this._MessageProvider.values.MESSAGE_CHECKING_TEMPLATE);
        let exists = templateExists(this._project.source);
        if (!exists)
         throw this._MessageProvider.values.MESSAGE_TEMPLATE_NOTFOUND;
            
    }

}

module.exports = CheckTemplateCommand;