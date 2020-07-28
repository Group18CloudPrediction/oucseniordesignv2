// uses HTML GeoLocation API to ask user for location, if none a defualt over ucf is initialized
function findLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initMap, mapFailed);
  } else {
      initMap({
        coords: {latitude: 28.6024,
        longitude: -81.2}
      })
  }
}

// takes coordinates and creates map
function initMap(position) {
  LatLng = {lat: position.coords.latitude, lng: position.coords.longitude};

  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15, //street level zoom
    mapTypeId: 'satellite', //satellite style map
    center: LatLng, //currently hardcoded over ucf should be able to pass variable to this
    scaleControl: true
  });

  addMarker(LatLng, map);
}

// error function
function mapFailed(error) {
  console.log("Error code: " + error.code + " | Error Message: " + error.message);
  // after error output, populate view with default position map
  initMap({
    coords: {latitude: 28.6024,
    longitude: -81.2}
  })
}

// adds a marker for a defined coordinate {lat: , long: x} to the map
function addMarker(LatLng, map)
{
  var marker = new google.maps.Marker({
    position: LatLng,
    map: map
  });
}

findLocation();

// populate view with systems
// foreach system addMarker(coord)