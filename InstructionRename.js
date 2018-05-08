const renameFile = require('./functions/RenameFile');
const Instruction = require('./Instruction');

class InstructionRename extends Instruction{


    constructor(oldName, newName){    
        super();    
        this.oldName = oldName;
        this.newName = newName;
    }

    main(){
        this.notify(this._MessageProvider.values.DEBUGGER_BEFORERENAMEFILE + ': ' + this.oldName);
        renameFile(this.oldName, this.newName);
        this.notify(this._MessageProvider.values.DEBUGGER_AFTERRENAMEFILE + ': ' + this.newName);
        
    }

}

module.exports = InstructionRename;