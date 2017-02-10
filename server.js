var scrapeLbc = require('./scrapeLbc.js');
var scrapeMA = require('./scrapeMA.js');
var formatage = require('./formatage.js');
var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.use(express.static('www'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/index.html" );
})

app.get('/process_get', function (req, res) {
    var url = req.query.url;
    scrapeLbc(url, function(url2){
        scrapeMA(url2, function(){
            res.sendFile( __dirname + "/www/result.html" );
        })
    })
})


var server = app.listen(3000, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://localhost:%s", port);
})
