// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require(__dirname + '/../helpers/archive-helpers.js');
exports.fetch = function(){
  archive.getListArray(archive.readListOfUrls);
};
