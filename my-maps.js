var markers = []; //Array of locations
var map;
var directionsService;
var directionsDisplay;
function initMap() {
  var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 41.85, lng: -87.65}
        });
        directionsDisplay.setMap(map);
  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    console.log("marker placed at " + e.latLng);
  });

var onClickHandler = function() {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}

  document.getElementById('getRoute').addEventListener('click', onClickHandler)
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
console.log(myOrigin);
console.log(myDestination);
console.log(numberOfMarkers);
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
