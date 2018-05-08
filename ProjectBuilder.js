const Project = require('./Project');

class ProjectBuilder {

    constructor(name) {
        this.name = name;
    }


    setSource(source) {
        this.source = source;
        return this;
    }

    setTarget(target) {
        this.target = target;
        return this;
    }


    setConfigurator(configurator) {
        this.configurator = configurator;
        return this;
    }

    setSchema(schema) {
        this.schema = schema;
        return this;
    }

    build() {
        return new Project(
            this.source, 
            this.target, 
            this.schema, 
            this.configurator);
    }

}

module.exports = ProjectBuilder;