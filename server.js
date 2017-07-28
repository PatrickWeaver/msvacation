var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var jsonfile = require('jsonfile');
var mongoose = require('mongoose');


var status;



var app = express();

var port = process.env.PORT || 3000;

var db;
var db = mongoose.connect(process.env.MONGOLAB_URI);

var Schema = mongoose.Schema;
 
var TripSchema = new Schema({
    destination    : String,
    duration       : String,
    transportation : String,
    date           : Date
});


var Trip = mongoose.model("Trip", TripSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/", function(req, res){
  var date = new Date();
  var todayOfTheWeek = date.getDay();
  
  
  jsonfile.readFile(__dirname + "/status.json", function(err, obj) {
    status = obj.status;
    var weekend = false;
    if (todayOfTheWeek > 5) {
      weekend = true;
    }
    
    if (status === "vacation") {
      res.sendFile(__dirname + "/views/vacation.html");
      
    } else {
      if (weekend){
        res.sendFile(__dirname + "/views/weekend.html");
      } else {
        res.sendFile(__dirname + "/views/index.html");
      }      
    } 
  });
});

app.get("/toggle", function(req, res) {
  jsonfile.readFile(__dirname + "/status.json", function(err, obj) {
    status = obj.status;
    if (status === "vacation") {
      obj.status = "working";
    } else {
      obj.status = "vacation";
    }
    
    jsonfile.writeFile(__dirname + "/status.json", obj, function(err) {
      if (err){
        throw err;
      } else {
        res.status(200);
        res.send("Meredith is now: " + obj.status);
      }
    });    
  });
});

app.post("/thank-you", function(req, res) {
  var d = new Date;
  var place = req.body.place;
  var duration = req.body.duration;
  var transportation = req.body.transportation;
  
  var newInput = {
    place: place,
    duration: duration,
    transportation: transportation,
    timestamp: d
  }
  
  var trip = new Trip(newInput);
  
  
  trip.save(function(err) {
    if (err) return handleError(err);
  });
  
  function handleError(err) {
    console.log(err);
    res.send("Error: " + err);
  }
  
  
  jsonfile.readFile(__dirname + "/input.json", function(err, obj) {
    var input = obj.input;

    
    obj.input.push(newInput);

    jsonfile.writeFile(__dirname + "/input.json", obj, function(err) {
      if (err){
        throw err;
      } else {
        res.status(200);
        res.sendFile(__dirname + "/views/thank-you.html");
      }
    }); 
  });
  
});

app.get("/input", function(req,res) {
  res.sendFile(__dirname + "/views/thank-you.html");
});

app.use('/public', express.static(__dirname + '/public'));

app.listen(port, function(){
  console.log('Gulp is running on PORT: ' + port);
});

module.exports = app;
