const Observable = require('./Observable');

class Instruction extends Observable{

    constructor(){
        super();
        this._logger =  require('./Logger');
        this._MessageProvider = require('./MessageProvider');
    }

    preProcess(){}
    main(){}
    postProcess(){}
    
    execute(){
        this.preProcess();
        this.main();
        this.postProcess();
    }


}

module.exports = Instruction;