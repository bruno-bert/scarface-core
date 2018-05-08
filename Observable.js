class Observable{
    
    constructor(){
        this.subscribers = [];
    }

    notify(data){
        this.subscribers.forEach( observer => {
            observer.notify(data);
        });
    }

    subscribe(observer){
        this.subscribers.push(observer);
    }

}

module.exports = Observable;