var http = require("http");
var handler = require("./request-handler");
var CronJob = require('cron').CronJob;
var fetch = require(__dirname + '/../workers/htmlfetcher.js');
var tab = new CronJob('* * * * * *', function(){
    fetch.fetch();
});
tab.start();

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

