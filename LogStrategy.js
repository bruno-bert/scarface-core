const path = require('path');
const {appendFile} = require('fs');


class LogStrategy {

 static toConsole(message){
   console.log(message);  
 }

 static withDate(message){
    let timestamp = new Date().toISOString();  
    console.log(`${timestamp} - ${message}`);
 }

 static toFile(message, file){
    let timestamp = new Date().toISOString();
    file = file || 'logs.txt';
    let fileName = path.join(__dirname, file);
     appendFile(fileName, `${timestamp} - ${message} \n`, error => {
         if (error){
             console.log('Error writing to file');
             console.error(error);
         }
     })
 }

 static none(){}
}

module.exports = LogStrategy;