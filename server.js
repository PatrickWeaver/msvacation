var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars')
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var request = require('request')


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


var db;

if(process.env.ENV == 'Test'){
  db = mongoose.connect('mongodb://localhost/msvacation_test');
}
else {
  db = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/msvacation');
}

var Vacation = require('./models/vacationModel');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var vacationRouter = require('./routes/vacationRoutes')(Vacation);


app.use('/api/vacations', vacationRouter);

var apidata;
var duration;


var durationlog = console.log(duration + " <<<")

var vacationfind = function(callback) {
  Vacation.find({ place: "Palos Verdes"}, function(err, vacation) {
  if (err) throw err;

  console.log(vacation);
  apidata = vacation;
  duration = vacation.duration;
});
};

vacationfind(durationlog);

console.log(apidata);

console.log(duration + " <<");


app.get('/', function(req, res){
  res.render('index', {
    place: apidata[0]["place"],
    duration: duration,
    transportation: ''

  });
});



app.use('/public', express.static(__dirname + '/public'));

app.listen(port, function(){
  console.log('Gulp is running on PORT: ' + port);
})

module.exports = app;