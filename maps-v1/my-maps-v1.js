var markers = []; //Array of locations
var map;
var directionsService;
var directionsDisplay;
 var geocoder;
function initMap() {
  geocoder = new google.maps.Geocoder();

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      lat: 18.5204,
      lng: 73.8567
    }
  });
  directionsDisplay.setMap(map);
  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    console.log("marker placed at " + e.latLng);
  });

  var onClickRoutesHandler = function() {
    setOriginDest(map, directionsService, directionsDisplay);
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


function calculateAndDisplayRoute(myOrigin, myDestination, map, directionsService, directionsDisplay) {
  var waypts = [];
  var numberOfMarkers = markers.length;
  var myOrigin = myOrigin;
  var myDestination = myDestination;


    for (var i = 0; i < markers.length; i++) {

      waypts.push({
        location: markers[i],
        stopover: true
      });
    }

  console.log("waypoints are: ");
  console.info(waypts)
  directionsService.route({
    origin: myOrigin,
    destination: myDestination,
    waypoints: waypts ? waypts : 'none',
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);

      generatePolyLines(map, response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function generatePolyLines(map, response) {

  var numberOfMarkers = markers.length;
  var myOrigin = markers[0];
  var myDestination = markers[numberOfMarkers - 1];
  var lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#393'
  };

  var line = new google.maps.Polyline({
    path: [],
    geodesic: true,
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  var bounds = new google.maps.LatLngBounds();


  var legs = response.routes[0].legs;
  for (i = 0; i < legs.length; i++) {
    var steps = legs[i].steps;
    for (j = 0; j < steps.length; j++) {
      var nextSegment = steps[j].path;
      for (k = 0; k < nextSegment.length; k++) {
        line.getPath().push(nextSegment[k]);
        bounds.extend(nextSegment[k]);
      }
    }
  }




  line.setMap(map);
  map.fitBounds(bounds);

  animateCircle(line);

}

function animateCircle(line) {
  var count = 0;
  window.setInterval(function() {
    count = (count + 1) % 200;

    var icons = line.get('icons');
    icons[0].offset = (count / 2) + '%';
    line.set('icons', icons);
  }, 100);
}

function setOriginDest(map, directionsService, directionsDisplay){
  var originAddress = document.getElementById('routeOrigin').value;

     geocoder.geocode( { 'address': originAddress}, function(results, status) {
       if (status == 'OK') {

       myOrigin = results[0].geometry.location;
       var destAddress = document.getElementById('routeDestination').value;

          geocoder.geocode( { 'address': destAddress}, function(results, status) {
            if (status == 'OK') {
          myDestination = results[0].geometry.location
          calculateAndDisplayRoute(myOrigin, myDestination, map, directionsService, directionsDisplay);

            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });

       } else {
         alert('Geocode was not successful for the following reason: ' + status);
       }
     });



}
