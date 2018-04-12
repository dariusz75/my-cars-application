1 - mongod
2 - npm start
3 - http://localhost:3000/








<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.js"></script>

</head>
<body>
<div id="friendslist" >


</div>

  <script id="friend-template" type="text/x-handlebars-template">
    <h1>{{name}} {{age}}</h1>
</script>
</body>
</html>





var friends = [
  {name: 'Fred', age: 20},
  {name: 'John', age: 30},
  {name: 'Anna', age: 40}
];



var friendsList = document.getElementById('friendslist');
var source   = document.getElementById("friend-template").innerHTML;
var template = Handlebars.compile(source);


friends.forEach(function(friend){
  var HTML = template(friend);
  var listHTML = friendsList.innerHTML; //get current html
  var newHTML = listHTML + HTML; //edit what ive copied
  friendsList.innerHTML = newHTML; //write new stuff
});
