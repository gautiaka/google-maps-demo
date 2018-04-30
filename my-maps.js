var markers = []; //Array of locations
var map;
var directionsService;
var directionsDisplay;
function initMap() {
  var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: {lat: 18.5204, lng: 73.8567}
        });
        directionsDisplay.setMap(map);
  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    console.log("marker placed at " + e.latLng);
  });

var onClickRoutesHandler = function() {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}
var onClickLinesHandler = function() {
  generatePolyLines(map);
}
  document.getElementById('getRoute').addEventListener('click', onClickRoutesHandler);
  document.getElementById('getPolylines').addEventListener('click', onClickLinesHandler);
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  markers.push(latLng);
  console.info(markers);
  map.panTo(latLng);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
var waypts = [];
var numberOfMarkers = markers.length;
var myOrigin = markers[0];
var myDestination = markers[numberOfMarkers - 1 ];
// console.log(myOrigin);
// console.log(myDestination);
// console.log(numberOfMarkers);
if(numberOfMarkers>2){
  for (var i = 0; i < markers.length; i++) {

           waypts.push({
             location: markers[i],
             stopover: true
           });
         }
}
     directionsService.route({
       origin: myOrigin,
       destination: myDestination,
       waypoints: waypts ? waypts : 'none',
                optimizeWaypoints: true,
       travelMode: 'DRIVING'
     }, function(response, status) {
       if (status === 'OK') {
         directionsDisplay.setDirections(response);
       } else {
         window.alert('Directions request failed due to ' + status);
       }
     });
   }

function generatePolyLines(map){
  console.log("polulines clicked");

  var numberOfMarkers = markers.length;
  var myOrigin = markers[0];
  var myDestination = markers[numberOfMarkers - 1 ];
  var flightPlanCoordinates = [
        myOrigin,
        myDestination
       ];
       var flightPath = new google.maps.Polyline({
         path: flightPlanCoordinates,
         geodesic: true,
         strokeColor: '#FF0000',
         strokeOpacity: 1.0,
         strokeWeight: 2
       });

       flightPath.setMap(map);
}
