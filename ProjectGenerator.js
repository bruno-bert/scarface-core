const Generator = require('./Generator');
const Project = require('./Project');
const ProjectBuilder = require('./ProjectBuilder');
const CommandList = require('./CommandList');


const DefaultValidator = require('./Validator');
const DefaultDialect = require('./Dialect');
const DefaultConfigurator = require('./Default.Config.js');

const DefaultSchemaBuilder = require('./SchemaBuilder');
const PathResolver = require('./PathResolver');

const Logger = require('./Logger');
const MessageProvider = require('./MessageProvider');



class ProjectGenerator extends Generator {

    constructor(params) {

        super();

        
        if (new.target === ProjectGenerator) {
            throw new TypeError('Cannot construct ProjectGenerator instances directly');
        }

        /* template parameter is required */
        if (!params  || !params.template) {
            throw new TypeError('Template is required');
        }

        /* set parameters sent in constructor */
        this.template = params.template;
        PathResolver.currentDirectory = params.directory;
        Logger.changeStrategy(params.log || 'toConsole');
        
        this.project = null;

        this.theConfigurator = DefaultConfigurator;
        this.theDialect = this.theConfigurator.dialect || new DefaultDialect();

        this.theSchemaBuilder = new DefaultSchemaBuilder({
            dialect: this.theDialect,
            template: this.template,
            validator: new DefaultValidator()
        });


    }



    addCommandList() {

        /* Sets the list of commands for generator */

        let ClearFolderCommand = require('./ClearFolderCommand');
        let CheckTemplateCommand = require('./CheckTemplateCommand');
        let CopyTemplateCommand = require('./CopyTemplateCommand');
        let BuildInstructionCommand = require('./BuildInstructionCommand');
        let ExecuteInstructionCommand = require('./ExecuteInstructionCommand');
        let AfterGenerationCommand = require('./AfterGenerationCommand');

     
        this.commandList = new CommandList(
                this.project, 
                Logger, 
                MessageProvider)
            .add(new CheckTemplateCommand())
            .add(new ClearFolderCommand())
            .add(new CopyTemplateCommand())
            .add(new BuildInstructionCommand())
            .add(new ExecuteInstructionCommand())
            .add(new AfterGenerationCommand());
    
    }


    run() {

        Logger.log(MessageProvider.values.DEBUGGER_START);

        if (!this.theConfigurator) {
            Logger.log(MessageProvider.values.MESSAGE_SETUP_CONFIGURATOR);
            return;
        }

        /* Builds the schema */
        let schema = this.theSchemaBuilder.build();

        /* Defines source and target folders */
        let source = PathResolver.templatePath(this.template);
        let target = PathResolver.destinationPath();

        /* Creates the Project Instance */
        this.project = new ProjectBuilder(schema.appconfig.name)
            .setSource(source)
            .setTarget(target)
            .setConfigurator(this.theConfigurator)
            .setSchema(schema)
            .build();


        /* Sets the list of commands for generator */
        this.addCommandList();

        /* Runs commands */
        super.run();

    }


    /* This is a observer to log messages from observable objects  */
    notify(message) {
        Logger.log(message);
    }

}

module.exports = ProjectGenerator;