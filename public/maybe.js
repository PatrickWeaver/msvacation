$.get( "/trips", function( data ) {
  var trip = data[Math.floor(Math.random() * data.length)];
  console.log(trip);
  for (var i in trip){
    console.log(i + ": " + trip[i]);
  }
  $( "#destination" ).html(trip.destination);
  $( "#duration" ).html(trip.duration);
  $( "#transportation" ).html(trip.transportation);
  
  $( "#trip" ).show();
});