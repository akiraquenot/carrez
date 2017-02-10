var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var scrapeMA = require('./scrapeMA.js');
var formatage = require('./formatage.js');
var app     = express();

module.exports=function(url, callback){

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var price, town, type, surface;
            var json = { price : "", town : "", type: "", surface : ""};

            var link_price = "#adview > section > section > section.properties.lineNegative > div:nth-child(5) > h2 > span.value";
            var link_town = "#adview > section > section > section.properties.lineNegative > div.line.line_city > h2 > span.value";
            var link_type = "#adview > section > section > section.properties.lineNegative > div:nth-child(7) > h2 > span.value";
            var link_type2 = "#adview > section > section > section.properties.lineNegative > div:nth-child(8) > h2 > span.value";
            var link_surface2 = "#adview > section > section > section.properties.lineNegative > div:nth-child(10) > h2 > span.value";
            var link_surface = "#adview > section > section > section.properties.lineNegative > div:nth-child(9) > h2 > span.value";

          $(link_price).each(function(){
            var data = $(link_price);
            var price_selector = data.text().trim();
            price_selector = price_selector.replace(/\D/g,'');
            json.price = price_selector.replace(/ /g,"");
          })

          $(link_town).each(function(){
            var data = $(link_town);
            var town_selector = data.text().trim();
            json.town = town_selector;
          })

          $(link_surface).each(function(){
            var data = $(link_surface);
            var surface_selector = data.text().trim();
            surface_selector = surface_selector.replace(/\D/g,'');
            json.surface = surface_selector.replace(/ /g,"").slice(0,-1);
          })

          $(link_type).each(function(){
            var data = $(link_type);
            var type_selector = data.text().trim();
            json.type = type_selector;
            if(json.type==("Oui"||"Non")) {
                type_selector2();
            }
          })

          function type_selector2(){

              $(link_type2).each(function(){
                var data = $(link_type2);
                var type_selector2 = data.text().trim();
                json.type = type_selector2;
              })

              $(link_surface2).each(function(){
                var data = $(link_surface2);
                var surface_selector2 = data.text().trim();
                surface_selector2 = surface_selector2.replace(/\D/g,'');
                json.surface = surface_selector2.replace(/ /g,"").slice(0,-1);
              })

          }
        }

        var myTown = json.town.formatage();
        var url2 = "https://www.meilleursagents.com/prix-immobilier/"+myTown;

        fs.writeFile('www/output.json', JSON.stringify(json, null, 4), function(err){
          console.log('File output.json successfully written!');
          callback && callback(url2);
        })
    })
}
