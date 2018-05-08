const path = require('path');
const fs = require('fs-extra');
const pathIsAbsolute = require('path-is-absolute');    
const constants = require('./Constants');


class PathResolver {

  constructor(currentDirectory) {    
    this.currentDirectory = currentDirectory;    
  }



  getExtension(file) {
    let ext = '';
    let ar = file.split('.');
    if (ar.length > 0) {
      ext = ar[ar.length - 1];
    }
    return ext;
  }

  
  getDeleteRules(folder) {
    let ex = [];
    ex.push(path.join(folder, '**'));
    ex.push('!' + folder);
    ex.push(path.join('!' + folder, constants.Files.FILE_USER_JSON));
    return ex;
  }



  appDir() {
    let dir = this.currentDirectory || this.modulePath();
    return dir;
  }

  destinationPath() {
    let filepath = path.join.apply(path, arguments);

    if (!pathIsAbsolute(filepath)) {
      filepath = path.join(this.appDir(), constants.General.APPLICATION_PATH, filepath);
    }

    return filepath;
  }

  modulePath() {
    return path.dirname(require.main.filename);
  }

  getParentPath(base, level){
    let i = 0;
    let directory = base;
   
    for(i = 0; i < level; i++) 
      directory = path.dirname(directory);
      
    return directory;  
  }


  templatePath(template) {
    let currentPath = path.dirname(require.main.filename);
    return path.join(this.getParentPath(currentPath,1), constants.General.TEMPLATE_PATH_PREFIX + template);
  }







}




module.exports = new PathResolver();

