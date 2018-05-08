const _ = require('lodash');
const path = require('path');

// A object literal is used to group all code from this library.
var js2model = js2model || {};

/* To use ES5 functions in IE8, we have to use polyfills. */
(function () {
  'use strict';

  /* 
        Uppercase the first letter of a string.
    */
  if (!String.prototype.capitalize) {
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
  }

  /* 
        The trim() method returns the string stripped of whitespace from both ends. trim() does not affect the value of the string itself.
    */
  if (!String.prototype.trim) {
    (function () {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function () {
        return this.replace(rtrim, '');
      };
    })();
  }

  /* 
        String.prototype.unCapitalize
        Uppercase the first letter of a string.
    */
  if (!String.prototype.unCapitalize) {
    String.prototype.unCapitalize = function () {
      return this.charAt(0).toLowerCase() + this.slice(1);
    };
  }
})();

(function (js2model) {
  'use strict';

  function Model() {
    this.name = null;
    this.additionalProperties = null;
    this.properties = null;
    this.objects = null;
    this.arrays = null;
  }

  // Register on namespace.
  js2model.Model = Model;
})(js2model);

(function (js2model) {
  'use strict';

  function Relation(parent, child, type) {
    this.parent = parent;
    this.child = child;
    this.type = type;
  }

  // Register on namespace.
  js2model.Relation = Relation;
})(js2model);

(function (js2model) {
  'use strict';

  function Javascript() {
    // / <summary>
    // / This component will generates 1 or more JavaScripts models from json.
    // / </summary>

    var self = this;

    // Inherit from "Target"
    js2model.Target.call(self);

    // Overwrite parent properties.
    self.capitalizePropertyName = false;
    self.fileExtension = '.js';
    self.name = 'JavaScript';
  }

  // Register on namespace.
  js2model.Javascript = Javascript;
})(js2model);

/*
(function (js2model) {
    "use strict";
  
}(js2model)); */

(function (js2model) {
  'use strict';

  function Options() {
    this.jsonSchemaFilePath = null;
    this.clearTarget = false;
    this.dialect = null;
  }

  // Register on namespace.
  js2model.Options = Options;
})(js2model);

(function (js2model) {
  'use strict';

  function Generator() {
    // / <summary>
    // / A component that converts a JSON schema file to 1 or multiple model files.
    // / </summary>
    var self = this;

    var _relations = [];

    var FormattedProperty = function (name, type, annotations) {
      this.name = name;
      this.type = type;
      this.annotations = annotations;
    };

    function convertJsonSchemaTypeToModel(modelname, schemaType, dialect) {
      // / <summary>
      // / Converts a json schema type to to a model.
      // / </summary>
      // / <param name="modelname" type="String">Name for the model to be created.</param>
      // / <param name="schemaType" type="Object">A JSON schema type.</param>
      // / <param name="target" type="js2model.Target">Meta data needed to create a language specific model.</param>

      var name = getModelName(modelname, dialect);
      var filePath = getModelFilePath(name, dialect);
      var model = new js2model.Model();

      var properties = getPropertiesContent(name, schemaType, dialect);
      var additionalProperties = getAdditionalProperties(
        name,
        schemaType,
        dialect
      );

      model.name = name;
      model.additionalProperties = additionalProperties;
      model.properties = properties;
      return model;
    }

    function getModelFilePath(model, dialect) {
      // / <summary>
      // / Determines the file path of model
      // / </summary>
      // / <param name="model" type="string"></param>
      // / <param name="target" type="js2model.Target"></param>
      // / <returns type="String"></returns>
      return path.join(
        dialect.destinationFolderPath,
        model + dialect.fileExtension
      );
    }

    function getModelName(modelname, dialect) {
      // / <summary>
      // / Replaces the given placeholder in the template by the given value.
      // / </summary>
      // / <param name="modelname" type="String"></param>
      // / <param name="target" type="js2model.Target"></param>
      // / <returns type="String">Adjusted modelname.</returns>

      var name = modelname.unCapitalize();
      if (dialect.capitalizeModelName) {
        name = modelname.capitalize();
      }
      return name;
    }

    function getAnnotationsContent(schemaType, property, dialect, name) {
      let implementedAnnotations = dialect.implementedAnnotations;
      let required = getRequired(dialect, schemaType.required, name);
      let annotations = [];
      let annotation = '';

      if (required) {
        annotations.push(required);
      }

      Object.keys(property)
        .filter(key => key != 'type' && key != 'required' && key != 'items')
        .forEach(key => {
          annotation = null;

          if (key === 'format') {
            annotation = dialect.convertAnnotation(property.format, null);
          } else {
            annotation = dialect.convertAnnotation(key, property[key]);
          }

          if (annotation) {
            annotations.push(annotation);
          }
        });

      return annotations;
    }

    function getRequired(dialect, required, name) {
      let json_required = 'required';
      let content = '';
      let exists = false;
      let ar = null;

      if (required != null) {
        exists = required.indexOf(name) != -1;
        if (exists) {
          content += dialect.convertAnnotation(json_required);
        }
      }

      return content || false;
    }
    function getAdditionalProperties(name, schemaType, dialect) {
      if (!schemaType.additionalProperties) {
        schemaType.additionalProperties = function (tableName) {
          this.tableName = tableName;
        };
      }

      schemaType.additionalProperties.tableName =
        schemaType.additionalProperties.tableName || name;

      return schemaType.additionalProperties;
    }

    function getPropertiesContent(model, schemaType, dialect) {
      var name = '';
      var properties = schemaType.properties;
      var propertyContent = null;
      var annotations = null;
      var template = null;
      var totalContent = '';
      var type = null;
      var propName = null;
      var formattedProperties = [];

      for (var prop in properties) {
        name = String(prop.unCapitalize());
        propName = name;
        if (dialect.capitalizePropertyName) {
          name = name.capitalize();
        }

        type = dialect.getPropertyType(properties[prop]);

        if (dialect.isOneToOne(properties[prop])) {
          _relations.push(new js2model.Relation(model, name, 'object'));
        }

        if (dialect.isOneToMany(properties[prop])) {
          _relations.push(new js2model.Relation(model, name, 'array'));
        }

        annotations = getAnnotationsContent(
          schemaType,
          properties[prop],
          dialect,
          propName
        );
        formattedProperties.push(
          new FormattedProperty(name, type, annotations)
        );
      }

      return formattedProperties;
    }

    function generateModelsForDialect(schema, dialect) {
      let definitions = null;
      let model = null;
      let filePath = null;
      let objects = null;
      let arrays = null;

      // Convert json schema types found in property "definitions".
      definitions = schema.definitions;
      for (var definition in definitions) {
        model = convertJsonSchemaTypeToModel(
          definition,
          definitions[definition],
          dialect
        );

        objects = filterRelations(model.name, _relations, 'object');
        arrays = filterRelations(model.name, _relations, 'array');

        model.objects = objects;
        model.arrays = arrays;

        dialect.models.push(model);
      }

      handleOneToOneRelations(dialect, dialect.models, objects);
    }

    function filterRelations(model, relations, type) {
      return _.filter(relations, function (rel) {
        return rel.parent === model && rel.type === type;
      });
    }

    function handleOneToOneRelations(dialect, models, relations) {
      relations.forEach(function (relation) {
        var relation = relation;
        relation.parent = relation.parent.capitalize();

        models.forEach(function (model) {
          if (model.name === relation.child) {
            if (!modelExists(model.properties, relation.parent)) {
              model.properties.push(
                new FormattedProperty(relation.parent, relation.parent, null)
              );
            }

            if (
              !modelExists(
                model.properties,
                relation.parent + dialect._IDPrefix
              )
            ) {
              model.properties.push(
                new FormattedProperty(
                  relation.parent + dialect._IDPrefix,
                  dialect._IDType,
                  null
                )
              );
            }
          }
        });
      });

      return models;
    }

    function modelExists(models, parent) {
      let index = _.findIndex(models, function (model) {
        return model.name === parent;
      });
      return index != -1;
    }

    // / <field name="options" type="js2model.Options">When options is a object literal, it is converted to a js2model.Options object.</field>
    self.options = new js2model.Options();

    self.generateModelsForDialect = generateModelsForDialect;
  }

  // Register on namespace.
  js2model.Generator = Generator;
})(js2model);

(function (js2model, module, require) {
  'use strict';

  // 'through2' is a thin wrapper around node transform streams.
  var through = require('through2');

  // 'fs' is used to interact with the filesystem.
  var fs = require('fs');

  // 'del' is used to clean the output folder.
  var del = require('del');

  // 'Q' is used to work with promises instead of callbacks.
  var Q = require('Q');

  function Shell(filepath, options, node) {
    var self = this;

    var generator = new js2model.Generator();
    generator.options = options || new js2model.Options();

    function cleanDestinationFolders() {
      del.sync(getDestinationFolders());
    }

    function getDestinationFolders() {
      destinationFolders.push(
        generator.options.dialect.destinationFolderPath + '*'
      );
      return destinationFolders;
    }

    // Define public interface.
    self.cleanDestinationFolders = cleanDestinationFolders;
    self.generator = generator;
  }

  function convert(schema, options) {
    var shell = new Shell(schema, options);
    try {
      if (options.clearTarget) {
        shell.cleanDestinationFolders();
      }

      shell.generator.generateModelsForDialect(schema, options.dialect);
    } catch (err) {
      console.log(err);
    }
  }

  // Register 'convert' function.
  js2model.convert = convert;

  // Export the complete js2model namespace.
  module.exports = js2model;
})(js2model, module, require);
