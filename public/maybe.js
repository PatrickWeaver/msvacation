function getTrip() {
  $.get( "/trips", function( data ) {
    $( "#trip" ).html("<h3><span id='destination'></span> for <span id='duration'></span> days and got there via <span id='transportation'</span>!</h3>");
    var trip = data[Math.floor(Math.random() * data.length)];
    console.log(trip);
    $( "#destination" ).html(trip.destination);
    $( "#duration" ).html(trip.duration);
    $( "#transportation" ).html(trip.transportation);
  });
}

getTrip();

$( "#maybe-refresh" ).click(function() {
  getTrip();
});