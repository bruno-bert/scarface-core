class Validator {

    constructor() {
       
        this.ValidationResult = function(result, message){
            this.result = result;
            this.message = message;
        };

    }


    _success(message){
        return new this.ValidationResult(true, message || '');
    }
    
    _fail(message){
        return new this.ValidationResult(false, message || '');
    }


}

module.exports = Validator;