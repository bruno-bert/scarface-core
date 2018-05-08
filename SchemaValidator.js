const Schema = require('./Schema');
const MessageProvider = require('./MessageProvider');
const Validator = require('./Validator');
const Utilities = require('./Utilities');

class SchemaValidator extends Validator {

    constructor() {

        super();

      
    }

  


    validate(schema) {

       
        if (!Utilities.checkType(schema, "Schema"))
            throw new TypeError(MessageProvider.values.MESSAGE_SCHEMA_TYPE);

             
        if (!schema)
            return this._fail(MessageProvider.values.MESSAGE_SCHEMA_NULL);

        switch (schema.type) {
            case ('default'): { return this._validateDefaultSchema(schema.theSchema); }
            case ('template'): { return this._validateTemplateSchema(schema.theSchema); }
            case ('user'): { return this._validateUserSchema(schema.theSchema); }
            default: { return this._success(); }
        }

    }


    _validateTemplateSchema(schema) {
        return this._success();
    }

    _validateDefaultSchema(schema) {
        return this._success();
    }

    _validateUserSchema(schema) {


        if (!schema) {
            return new this.ValidationResult(
                false,
                MessageProvider.values.MESSAGE_VALIDATION_NOTFOUND_USERSCHEMA
            );
        }

        if (!schema.appconfig) {
            return new this.ValidationResult(
                false,
                MessageProvider.values.MESSAGE_VALIDATION_APPCONFIG
            );
        }

        if (!schema.appconfig.template) {
            return new this.ValidationResult(
                false,
                MessageProvider.values.MESSAGE_VALIDATION_APPCONFIG_TEMPLATE
            );
        }

        return new this.ValidationResult(
            true,
            MessageProvider.values.MESSAGE_VALIDATION_SCHEMA);
    }


}

module.exports = SchemaValidator; 