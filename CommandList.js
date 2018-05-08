class CommandList {

    constructor(project, logger, messageProvider) {
        this.items = [];
        this._logger = logger || console;
        this._project = project;
        this._MessageProvider = messageProvider;
    }

    set Logger(newLogger) {
        this._logger = newLogger;
        return this;
    }

    set Project(newProject) {
        this._project = newProject;
        return this;
    }

    set MessageProvider(newMessageProvider){
        this._MessageProvider = newMessageProvider;
    }


    /**
    * @param {Command} item The command
    */
    add(command) {
        command.Logger = this._logger;
        command.Project = this._project;
        command.MessageProvider = this._MessageProvider;
        this.items.push(command);
        return this;
    }


    clone(){
        
        /* clone method is not being used */

        let proto = Object.getPrototypeOf(this);
        let cloned = Object.create(proto);
        
        cloned.Project = this._project;
        cloned.Logger = this._logger;
        cloned.MessageProvider = this._MessageProvider;
        cloned.items = [...this.items];

        return cloned;
            
    }



 
}

module.exports = CommandList;