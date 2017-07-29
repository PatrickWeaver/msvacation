var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var mongoose = require('mongoose');

//var status;

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

var StatusSchema = new Schema({
  status         : String,
  date           : Date
});


var Trip = mongoose.model("Trip", TripSchema);
var Status = mongoose.model("Status", StatusSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

function getNewestStatus(callback) {
  Status.findOne({}, {}, { sort: { "date": -1 }}, function(err, newestStatus) {
    callback(newestStatus);
  });
}

function handleError(res, err) {
  console.log(err);
  res.send("Error: " + err);
}


app.get("/", function(req, res){
  
  getNewestStatus(respondNewestStatus);
  
  function respondNewestStatus(newestStatus){

    var status = newestStatus.status;
    
    if (status === "vacation") {
      res.sendFile(__dirname + "/views/vacation.html");
    } else {
      var date = new Date();
      var todayOfTheWeek = date.getDay();
      var weekend = false;
      if (todayOfTheWeek > 5) {
        weekend = true;
      }
      if (weekend){
        res.sendFile(__dirname + "/views/weekend.html");
      } else {
        res.sendFile(__dirname + "/views/index.html");
      }  
    }
  }
});

app.get("/toggle", function(req, res) {
  
  getNewestStatus(toggleNewestStatus);
  
  function toggleNewestStatus(newestStatus) {
    var status;
    if (newestStatus && newestStatus.status === "vacation") {
      status = "working";
    } else {
      status = "vacation";
    }

    var newStatus = {
      status: status,
      date: new Date
    }

    var updateStatus = new Status(newStatus);
    updateStatus.save(function(err) {
      if (err) {
        handleError(res, err);
      } else {
        res.status(200);
        res.send("Meredith is now: " + status);
      }
    });
  }
});

app.post("/thank-you", function(req, res) {
  var d = new Date;
  var destination = req.body.place;
  var duration = req.body.duration;
  var transportation = req.body.transportation;
  
  var newInput = {
    destination: destination,
    duration: duration,
    transportation: transportation,
    date: d
  }
  
  var trip = new Trip(newInput);
  
  
  trip.save(function(err) {
    if (err) {
      handleError(res, err);
    }
    res.sendFile(__dirname + "/views/thank-you.html");
  });
  
});

app.get("/input", function(req,res) {
  res.sendFile(__dirname + "/views/thank-you.html");
});

app.get("/trips", function(req, res) {
  
  Trip.find(function(err, trips) {
    if (err) {
      handleError(res, err);
    } else {
      console.log(trips);
    }
    res.send(trips); 
  });    
});

app.use('/public', express.static(__dirname + '/public'));

app.listen(port, function(){
  console.log('Gulp is running on PORT: ' + port);
});

module.exports = app;
