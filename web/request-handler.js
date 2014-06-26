var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.router = router = {
  'GET': httpHelpers.getHandler,
  'POST': httpHelpers.postHandler
}
exports.handleRequest = function (req, res) {
  router[req.method](req, res);
  // res.end(archive.paths.list);
};
