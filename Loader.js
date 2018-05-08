const defaultParent = 'scarface-core';

class LoadModuleStrategy{

    
    static dev(name, parent){
       /* can implement a strategy to load modules in dev mode for example */
       return null;
    }

    static prod(name, parent){       
        let module = require('../../' + parent + '/' + name);
        return module;
    }

}


class ModuleLoader {

    constructor(strategy='prod'){
        this.strategy = LoadModuleStrategy[strategy];        
    }


    changeStrategy(newStrategy){
        this.strategy = LoadModuleStrategy[newStrategy];
    }

    load(name, parent) {    
        parent = parent || defaultParent;   
      return this.strategy(name, parent);
    }
    
}

module.exports = new ModuleLoader('prod');