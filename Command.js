const Observable  = require('./Observable');

class Command extends Observable{
    
    execute(){
        return;
    }

}

module.exports = Command;