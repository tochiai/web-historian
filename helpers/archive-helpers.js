var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require(__dirname + '/../web/http-helpers.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
var listArray = [];

exports.getListArray = getListArray = function(callback, path){
  var options = {encoding: 'utf-8'};
  fs.readFile(__dirname + '/../archives/sites.txt', options, function (err, data) {
    if (err) throw err;
    listArray = data.split('\n');
    callback(path);
  });
};

exports.readListOfUrls = function(){

};

exports.isUrlInList = function(path, res, req){
  fs.readFile(__dirname + '/../archives/sites.txt', {encoding: 'utf-8'}, function (err, data) {
    if (err){
      throw err;
    } else {
      listArray = data.split('\n');
      var inList = false;
      for(var i=0; i<listArray.length; i++){
        if(path.slice(1) === listArray[i]){
          isUrlArchived(path, res, req);
          inList = true;
        }
      }
      if(!inList){
        addUrlToList(path);
        httpHelpers.serveAssets(res, '/public/loading.html', req);
      }
    }
  });
};

exports.addUrlToList = addUrlToList = function(path){
  fs.appendFile(__dirname + '/../archives/sites.txt', path.slice(1) + '\n', function(err){
    console.log(err);
  });
};

exports.isUrlArchived = isUrlArchived = function(path, res, req){
  fs.readdir(__dirname + '/../archives/sites', function(err, files){
    for(var i=0; i<files.length; i++){
      if(path.slice(1) === listArray[i]){
        httpHelpers.serveAssets(res, '/../archives/sites' + path, req);
      } else {
        httpHelpers.serveAssets(res, '/public/loading.html', req);
      }
    }
  });

};

exports.downloadUrls = function(){
};
