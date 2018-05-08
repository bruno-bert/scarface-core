const fs = require('fs-extra');
const Instruction = require('./Instruction');

class InstructionCopy extends Instruction{


    constructor(fileFrom, fileTo){
        super();
        this.fileFrom = fileFrom;
        this.fileTo = fileTo;
    }

    main(){
        this.notify(this._MessageProvider.values.DEBUGGER_COPYFILE + ': ' + this.fileTo);   
        fs.copyFileSync(this.fileFrom, this.fileTo);
    }

}

module.exports = InstructionCopy;