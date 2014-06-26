var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers.js');
var url = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = serveAssets = function(res, asset) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(__dirname + asset, function(err, contents) {
      if(err){
        console.log(err);
      } else {
        sendResponse(res, 200, contents);
      }
    });
};

exports.getHandler = function(req, res){
  var path = url.parse(req.url).pathname;
  if(path === '/'){
    serveAssets(res, '/public/index.html');
  } else {
    archive.isUrlInList(path, res);
  }
};
exports.sendResponse = sendResponse = function(response, statusCode, contents){
  response.writeHead(statusCode, headers);
  response.end(contents);
};


// As you progress, keep thinking about what helper functions you can put here!
