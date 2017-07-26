var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars')
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var request = require('request')
var jsonfile = require('jsonfile');


var status;



var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var apidata;
var duration;
var onvacation;


var date = new Date();
var todayOfTheWeek = date.getDay();


app.get('/', function(req, res){
  jsonfile.readFile(__dirname + "/status.json", function(err, obj) {
    console.log(obj);
    status = obj.status;
    
  if (status === "working") {
    res.render('vacationindex', {
      place: '',
      duration: duration,
      transportation: '',
      css: 'vacation'
    });
    
  }
    
    
  })
  

});


app.use('/public', express.static(__dirname + '/public'));

app.listen(port, function(){
  console.log('Gulp is running on PORT: ' + port);
})

module.exports = app;
