const Command = require('./Command');
const DefaultMessageProvider = require('./MessageProvider');

class GeneratorCommand extends Command {

    constructor(project, logger, messageProvider){

        super();
        
        this._project = project;
        this._logger = logger || console;
        this._MessageProvider = messageProvider || DefaultMessageProvider;

    }
    
    set Logger(newLogger){
        this._logger = newLogger;
    }

    set Project(newProject){
        this._project = newProject;
    }

    set MessageProvider(newMessageProvider){
        this._MessageProvider = newMessageProvider;
    }

    preProcess(){}
    main(){}
    postProcess(){}
    undo(){}


    execute(){
        this.preProcess();
        this.main();
        this.postProcess();
    }

    notify(data){
        this._logger.log(data);
    }

   

}

module.exports = GeneratorCommand;