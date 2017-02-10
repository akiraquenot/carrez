var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var formatage = require('./formatage.js');

module.exports=function(url, callback){

  request(url, function(error, res, html){
    if(!error){
      var $ = cheerio.load(html);

      var price_flat, price_house;
      var json = { price_house : "", price_flat : ""};



      var item_link_price_flat= "#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(3) > div.small-4.medium-2.columns.prices-summary__cell--median";
      var item_link_price_house = "#synthese > div.prices-summary.baseline > div.prices-summary__values > div:nth-child(2) > div.small-4.medium-2.columns.prices-summary__cell--median";


	  $(item_link_price_flat).each(function(){
        var data = $(item_link_price_flat);
        var price_flat = data.text().trim();
        json.price_flat = price_flat;
        price_flat = price_flat.replace(/\D/g,'');
        json.price_flat = price_flat.replace(/ /g,"");
      })

 $(item_link_price_house).each(function(){
        var data = $(item_link_price_house);
        var price_house = data.text().trim();
        json.price_house = price_house;
        price_house = price_house.replace(/\D/g,'');
        json.price_house = price_house.replace(/ /g,"");


      })
    }
    fs.writeFile('www/output2.json', JSON.stringify(json, null, 4), function(err,res){
      console.log('File output2.json successfully written!');
      callback && callback();
    })
  })
}
