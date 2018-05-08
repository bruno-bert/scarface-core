const path = require('path');
const override = require('json-override');

const Constants = require('./Constants');
const Schema = require('./Schema');
const SchemaReader = require('./SchemaReader');
const Logger = require('./Logger');
const PathResolver = require('./PathResolver');
const MessageProvider = require('./MessageProvider');



class SchemaBuilder {

    constructor(options) {
        
        this.theDefaultSchema = null;
        this.theUserSchema = null;
        this.theTemplateSchema = null;        
        this.theResolvedSchema = null;

        this.theValidator = options.validator;    
        this.template = options.template;
        this.theDialect = options.dialect;
    }
    
    
    setDialect(newDialect){
        this.theDialect = newDialect;
    }

    setValidator(newValidator){
        this.theValidator = newValidator;
    }

    setTemplateName(newDialect){
        this.theDialect = newDialect;
    }


    _setUserSchema(file) {       
        this.theUserSchema = new Schema('user', SchemaReader.read(file));
    }

    _setTemplateSchema(file) {       
        this.theTemplateSchema = new Schema('template', SchemaReader.read(file));
    }

    _setDefaultSchema(file) {       
        this.theDefaultSchema = new Schema('default', SchemaReader.read(file));
    }


    read() {

        Logger.log(MessageProvider.values.DEBUGGER_READ_SCHEMA);
        
        this._setUserSchema(PathResolver.destinationPath(Constants.Files.FILE_USER_JSON));
        this._setDefaultSchema(path.join(PathResolver.modulePath(), Constants.Files.FILE_DEFAULT_JSON));
        this._setTemplateSchema(path.join(PathResolver.templatePath(this.template), Constants.Files.FILE_TEMPLATE_JSON));

        return this;
        
    }

    validate() {

        Logger.log(MessageProvider.values.DEBUGGER_VALIDATE_SCHEMA);

        let validationResult = null;

        if (!this.theValidator)
            Logger.log(MessageProvider.values.DEBUGGER_VALIDATOR_SCHEMA_NOTDEFINED);
      

        validationResult = this.theValidator.validate(this.theDefaultSchema);
        if (!validationResult.result) {
            throw validationResult.message;
        }


        if (this.theUserSchema) {
            validationResult = this.theValidator.validate(this.theUserSchema);
            if (!validationResult.result) {
                throw validationResult.message;
            }
        }


        try {
            validationResult = this.theValidator.validate(this.theTemplateSchema);
            if (!validationResult.result) {
                throw validationResult.message;
            }
        } catch (ex) {
            throw ex;
        }

        return this;
    }


    resolve() {
        
        Logger.log(MessageProvider.values.DEBUGGER_RESOLVE_SCHEMA);

        this.theResolvedSchema = override(this.theDefaultSchema.theSchema, this.theTemplateSchema.theSchema);
      
        if (this.theUserSchema)
          this.theResolvedSchema = override( this.theResolvedSchema, this.theUserSchema.theSchema);
    
        // Overrides appmodel completely with user appmodel (if informed by user)
        this.theResolvedSchema.appmodel = this.theUserSchema.theSchema 
                                          && this.theUserSchema.theSchema.appmodel ?
                                          this.theUserSchema.theSchema.appmodel :
                                          this.theResolvedSchema.appmodel;
      
        return this;

      }


    
      convert(){
        this.theResolvedSchema = this.theDialect.convertSchema(this.theResolvedSchema);  
        return this;
      }


      defaults(){        
        return this;    
      }


      build() {

        this.read()
            .validate()
            .resolve()
            .defaults()
            .convert();

        return this.theResolvedSchema;

    }


}

module.exports = SchemaBuilder;