class MessageProvider {

    constructor(){
        this.source = 'Messages.json';
        this.values = null;        
        this.refresh();
    }

    refresh(){        
        this.values = require('./' + this.source);        
    }

    set sourceFile(theSource){
        this.source = theSource;
        this.refresh();
    }
    
}

module.exports = new MessageProvider();