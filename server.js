//require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/first_cars';

console.log(MONGODB_URI);

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

mongoose.Promise = global.Promise;
var promise = mongoose.connect(MONGODB_URI);

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

// SCHEMA
var Schema = mongoose.Schema;
var carSchema = new Schema({
  make:  String,
  bhp: Number,
});

// MODEL
var Car = mongoose.model('Car', carSchema);

// READ
app.get('/cars/:id?', function(req, res){
  var queryObj = {};
  if (req.params.id) {
    queryObj._id = req.params.id;
  }
  Car.find(queryObj).exec(function(err, cars){
    if (err) return res.status(500).send(err);
    res.status(200).json(cars);
  });
});

// CREATE
app.post('/cars', function(req, res){
  console.log('new car data', req.body);
  var carData = req.body;
  var newCar = new Car(carData);
  newCar.save(function (err, car) {
    if (err) return res.status(500).send(err);
    res.status(201).send(car);
  });
});

// UPDATE
app.put('/cars/:id', function(req, res) {
  var updateableCarId = req.params.id;
  Car.update({ _id: updateableCarId }, req.body, function (err, raw) {
      if (err) return handleError(err);
      if (raw.nModified === 0) return res.sendStatus(404);
      console.log('The raw response from Mongo was ', raw);
      return res.sendStatus(200);
  });
});

// DELETE
app.delete('/cars/:id', function(req, res){
  console.log('Car to be deleted: ', req.params.id);
  var deletableCarId = req.params.id;
  Car.remove({ _id : deletableCarId }, function (err, deletedCar) {
    if (err) return res.status(500).send(err);
    res.status(204).json(deletedCar);
  });
});



app.listen(PORT, function(){
  console.log('Server listening on port ' + PORT);
});
