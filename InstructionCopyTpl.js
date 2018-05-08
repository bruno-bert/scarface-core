const fs = require('fs-extra');
const ejs = require('ejs');
const InstructionCopy = require('./InstructionCopy');

class InstructionCopyTpl extends InstructionCopy{


    constructor(fileFrom, fileTo, data){
        super(fileFrom, fileTo);      
        this.data = data;        
    }

    main(){
        this.notify(this._MessageProvider.values.DEBUGGER_REPLACEFILE + ': ' + this.fileTo);
        fs.copyFileSync(this.fileFrom, this.fileTo);
        ejs.renderFile(this.fileTo, { data: this.data }, (err, str) => {
            if (err)
             this._logger.log(err);
            else 
             fs.writeFileSync(this.fileTo, str);
        });
    }

}

module.exports = InstructionCopyTpl;