//require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use(express.static('public'));
//console.log('secret:\n\n', process.env.MY_BIG_SECRET);

mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/first_cars');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});



//Mongo DB Schema
var Schema = mongoose.Schema;

var CarSchema = new Schema({
  make:  String,
  bhp: Number,
  year: Number
});

//Mongo DB Model
var Car = mongoose.model('Car', CarSchema);


app.get('/cars/:id?', function(req, res) {
  var queryObj = {};
  if (req.params.id) {
    queryObj._id = req.params.id;
  }
  Car.find(queryObj).exec(function(err, cars){
    if (err) return res.status(500).send(err);
    res.status(200).json(cars);
  });
});


app.post('/cars', function(req, res) {
  console.log(req.body);
  var carData = req.body;
  var newCar = new Car(carData);
  newCar.save(function (err, car) {
    if (err) return res.status(500).send(err);
    res.status(201).send(car);
  });
});


app.delete('/cars/:id', function(req, res) {
  console.log('Car to be deleted: ', req.params.id);
  deletableCarId = req.params.id;
  Car.remove({ _id : deletableCarId }, function(err, deletedCar) {
    if (err) return res.Status(500).send(err);
    res.sendStatus(204);
  });
});


app.put('/cars/:id', function(req, res) {
  updatableCarId = req.params.id;
  Car.update({ _id : updatableCarId }, req.body, function(err, raw) {
    if (err) return handleError(err);
    console.log('The row response from Mongo was ', raw);
    return res.sendStatus(200);
  });
});


app.listen(3000, function(){
  console.log('Server listening');
});
