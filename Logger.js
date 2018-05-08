const LogStrategy = require('./LogStrategy');

class Logger {

    constructor(strategy='toConsole'){
        this.strategy = LogStrategy[strategy];
    }

    changeStrategy(newStrategy){
        this.strategy = LogStrategy[newStrategy];
    }

    log(message) {       
      this.strategy(message);
    }
    
}
module.exports = new Logger();