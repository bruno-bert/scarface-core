 
  class Dialect {
    // This is an abstract class
  
    constructor() {

      this.format = require('string-format');
      this.lodash = require('lodash');

      this.verbs = this.mapVerbs();
      this.implementedAnnotations = this.mapImplementedAnnotations();
      this.types = this.mapTypes();
      this.formats = this.mapFormats();
      this.parametersIn = this.mapParametersIn();
      this.name = 'node';
      this.fileExtension = '.js';
      this._IDType = 'int';
      this.capitalizeModelName = true;
      this.capitalizePropertyName = true;
      this.destinationFolderPath = 'Models';
      this.projectName = 'App';
      this._IDPrefix = 'Id';
      this._IDType = 'int';
      this.models = [];
      this.arrayImplementer = '[]';
    }
  
    getPropertyType(property) {
      var ref = null;
      var type = null;
      var typeName = null;
  
      type = property.type;
  
      if (!type) {
        type = property.$ref.split(/[/ ]+/).pop();
        type = type.capitalize();
      }
  
      if (type === 'array') {
        type = property.items.$ref.split(/[/ ]+/).pop();
        type = this.format(this.arrayImplementer, type.capitalize());
      }
  
      return type;
    }
  
    isOneToOne(property) {
      return property.$ref && !property.type;
    }
    isOneToMany(property) {
      return property.type === 'array';
    }
    mapVerbs() {
      return new Map();
    }
    mapTypes() {
      return new Map();
    }
    mapFormats() {
      return new Map();
    }
    mapImplementedAnnotations() {
      return new Map();
    }
    mapParametersIn() {
      return new Map();
    }
    toString() {
      return this.name;
    }
  
    convertVerb(verb) {
      return !verb ? null : this.verbs.get(verb) || verb;
    }
    convertParameterIn(parameterIn) {
      return !parameterIn ?
        null :
        this.parametersIn.get(parameterIn) || parameterIn;
    }
  
    convertType(type, format) {
      let tmp = !type ? null : this.types.get(type) || type;
      return this.convertFormat(tmp, format);
    }
  
    convertFormat(type, format) {
      return !type ? null : this.formats.get(format) || type;
    }
  
    convertAnnotation(key, value) {
      let content = '';
      let item = null;
  
      item = this.implementedAnnotations.get(key);
  
      if (item) {
        content = value ? this.format(item, value) : item;
      } else {
        content = null;
      }
  
      return content;
    }
  
    convertSchema(schema) {
      this.convertPaths(schema.paths);
      this.convertModels(schema.appmodel.definitions);
  
      return schema;
    }
  
    convertParameters(parameters) {
      let self = this;
      if (parameters) {
        parameters.forEach(function (parameter) {
          parameter.in = self.convertParameterIn(parameter.in);
          parameter.type = self.convertType(parameter.type, parameter.format);
        });
      }
  
      return parameters;
    }
  
    convertPaths(paths) {
      let self = this;
      if (paths) {
        paths.forEach(function (path) {
          path.verb = self.convertVerb(path.verb);
          path.parameters = self.convertParameters(path.parameters);
        });
      }
  
      return paths;
    }
  
    convertProperties(properties) {
      let self = this;
      let property = null;
      if (properties) {
        // Models is an object, not an array, reason why models.forEach does not work
        Object.keys(properties).forEach(key => {
          property = properties[key];
          property.type = self.convertType(property.type, property.format);
        });
      }
  
      return properties;
    }
  
    convertModels(models) {
      let self = this;
      let model = null;
  
      if (models) {
        // Models is an object, not an array, reason why models.forEach does not work
        Object.keys(models).forEach(key => {
          model = models[key];
          model.properties = self.convertProperties(model.properties);
        });
      }
  
      return models;
    }
  }
  
  module.exports = Dialect;
  