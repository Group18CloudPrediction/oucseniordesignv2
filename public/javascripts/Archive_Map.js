var LatLng;
if (navigator.geolocation) {
    var position = navigator.geolocation.getCurrentPosition(showPosition);
    LatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
  } else {
    LatLng = {lat: 28.6024, lng: -81.2};
  }

  console.log(LatLng.lat + " " + LatLng.lng);

var map = new google.maps.Map(document.getElementById("archivemap"), {
  zoom: 15, //street level zoom
  mapTypeId: 'satellite', //satellite style map
  center: LatLng, //currently hardcoded over ucf should be able to pass variable to this
  scaleControl: true
});

var marker = new google.maps.Marker({
  position: LatLng,
  map: map
});
