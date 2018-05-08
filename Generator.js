class Generator {

    constructor (){ 
              
        this.commandList = null; 
       
        if (new.target === Generator) {
            throw new TypeError('Cannot construct Generator instances directly');
        }

    }

    run() {

        if ((this.commandList) && (this.commandList.items)) {
            for (var i = 0, len = this.commandList.items.length; i < len; i++) {
                this.commandList.items[i].execute();
            }
        }
    }

}

module.exports = Generator;