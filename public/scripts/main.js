
$(function(){

var HOSTNAME = '//localhost:3000';

var updating = false;
var carToBeUpdeted = null;

var $carsList = $("#ajax-content");
var $carCountIndicator = $("#car-count");
var $formTitle = $('#form-title');
var $originalFormTitle = $('#form-title').text();
var $submitButton = $('.submit-btn');
var $submitButtonText = $('.submit-btn').text();
var $form = $('#car-form');
var $makeInput = $form.find('#make');
var $bhpInput = $form.find('#bhp');
var $yearInput = $form.find('#year');

var activeButtonClass = 'active';

//handlebars templating
var source = $("#profile-template").html();
var templateFn = Handlebars.compile(source);
//var toPlace = document.getElementById("ajax-content");

var _cars = [];

function resetForm() {
  $form.find('input[type="text"], input[type="number"]').val('');
}

function removeCar(id) {
  var i = _cars.findIndex(function(car){
    return id === car._id;
  });
  _car.splice(i, 1);
}

function updateCar(car, data) {
    var i = _cars.findIndex(function(car){
      return car._id === carToBeUpdated._id;
    });
    _cars[i] = Object.assign({}, _cars[i], data);
  }

 function writeCarsToPage() {
     $carsList.html('');
     $carCountIndicator.text(_cars.length);
     _cars.forEach(function(car){
       $carsList.append(templateFn(car));
     });
   }

/*
function updateUI() {
  $carsList.html('');
  $carCountIndicator.text(_cars.length);
  _cars.forEach(function(car){
    $carsList.append(templateFn(car));
  });
}
*/

function handleAjaxFail (err) {
  console.log(err.message);
  alert('Ajax failed!');
}


// Initial GET cars
$.ajax({
  url: HOSTNAME + '/cars'
})
.done(function(cars){
  _cars = cars;
  writeCarsToPage();
})
.fail(handleAjaxFail);


$form.on('submit.addOrUpdate', function(e){

  var bhpNumber = parseInt($bhpInput.val(), 10);
  var yearNumber = parseInt($yearInput.val(), 10);

  if (isNaN(bhpNumber) || isNaN(bhpNumber)) {
    $bhpInput.val('');
    alert('Value must be an integer!');
    return;
  }

  var data = {
    make: $makeInput.val(),
    bhp: bhpNumber,
    year: yearNumber
  };

// Default options to perform a POST request
var callOptions = {
    url: HOSTNAME + '/cars',
    method: 'POST',
    data: data
};
  //console.log(callOptions);

  if (updating) {
      callOptions.method = 'PUT';
      callOptions.url = HOSTNAME + '/cars/' + carToBeUpdated._id;
    }


    $.ajax(callOptions)
        .done(function(car) {
          console.log(car);
          if (updating) {
            updateCar(car, data);
            exitUpdating();
          } else {
            _cars.push(car);
          }
          writeCarsToPage();
        })
        .fail(handleAjaxFail);

    e.preventDefault();
})

// Delete car
 $carsList.on('click.delete', '.delete', function(e) {
   // Find the ID
   var carID = $(this).data('id');

   $.ajax({
     url: HOSTNAME + '/cars' + carID,
     method: 'DELETE',
   })
   .done(function() {
     removeCar(carID);
     writeCarsToPage();
   })
   .fail(handleAjaxFail);

   e.preventDefault();
 });


 // Put app into 'updating' state
   function setUpForUpdate(id) {
     // Set the flag
     updating = true;
     // Set the car we're currently updating
     carToBeUpdated = _cars.find(function(car){
       return car._id === id;
     });
     console.log('setting ' + carToBeUpdated.make + ' to be updated');
     // Put current values into the form inputs
     $makeInput.val(carToBeUpdated.make);
     $bhpInput.val(carToBeUpdated.bhp);

     // Change form title and submit button text to match
     $formTitle.text('Update ' + carToBeUpdated.make);
     $submitButton.text('Update');
   }


   // Reset app to default state
    function exitUpdating() {
      console.log('exiting update');
      // Reset Flags & values
      updating = false;
      carToBeUpdated = null;

      // Reset DOM
      // DOM node text
      $formTitle.text($originalFormTitle);
      $submitButton.text($submitButtonText);

      // Empty the form
      resetForm();
    }

    // updating
      $carsList.on('click.update', '.update', function(e) {
        // Find the button
        var $btn = $(this);
        // Allow for toggling
        if($btn.hasClass(activeButtonClass)){
          // Here the button is already clicked and the app is in 'updating' mode. When the user clicks it again, we...
          // Reset the button to normal
          $btn.removeClass(activeButtonClass);
          // Reset the app state from updating mode
          exitUpdating();
        } else {
          // Make all other buttons non-active
          $('.update').removeClass(activeButtonClass);
          // Make this one active
          $btn.addClass(activeButtonClass);

          // Set the app state to be updating
          setUpForUpdate($btn.data('id'));
        }
        e.preventDefault();
      });





console.log(_cars);
});


//'//localhost:3000/cars'
//'//jsonplaceholder.typicode.com/comments/111'
