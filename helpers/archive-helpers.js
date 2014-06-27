var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require(__dirname + '/../web/http-helpers.js');
var http = require('http-request');

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

exports.getListArray = getListArray = function(callback){
  var options = {encoding: 'utf-8'};
  fs.readFile(__dirname + '/../archives/sites.txt', options, function (err, data) {
    if (err) throw err;
    listArray = data.split('\n');
    listArray.pop();
    callback();
  });
};

exports.readListOfUrls = function(){
  for(var i=0; i<listArray.length; i++){
    isUrlArchived(listArray[i]);
  }
};

exports.isUrlInList = function(path, res, req){
  console.log(path === null)
  fs.readFile(__dirname + '/../archives/sites.txt', {encoding: 'utf-8'}, function (err, data) {
    if (err){
      throw err;
    } else {
      listArray = data.split('\n');
      listArray.pop();
      var inList = false;
      for(var i=0; i<listArray.length; i++){
        if(path === listArray[i]){
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
  fs.appendFile(__dirname + '/../archives/sites.txt', path + '\n', function(err){
    console.log(err);
  });
};

exports.isUrlArchived = isUrlArchived = function(path, res, req){
  if(typeof res === 'object'){
    var resCheck = true;
  } else {
    var resCheck = false;
  }
  fs.readdir(__dirname + '/../archives/sites', function(err, files){
    var inFiles = false;
    for(var i=0; i<files.length; i++){
      if(path === files[i]){
        inFiles = true;
      }
      console.log('i = ' + i + ' inFiles = ' + inFiles)
    }
    if(!inFiles){
      if(resCheck){
        httpHelpers.serveAssets(res, '/public/loading.html', req);
      } else {
        downloadUrls(path);
      }
    } else {
      if(resCheck){
        console.log('is Response')
        httpHelpers.serveAssets(res, '/../archives/sites/' + path, req);
      }
    }
  });

};

exports.downloadUrls = downloadUrls = function(path){
  if(path.slice(0,4) === 'www.'){
    http.get({
      url: path,
      progress: function (current, total) {
        console.log('downloaded %d bytes from %d', current, total);
      },
    }, __dirname + '/../archives/sites/' + path, function (err, res) {
      if (err) {
        console.error(err);
        return;
      // console.log(res.code, res.headers, res.file);
      }
    });
  }
};
