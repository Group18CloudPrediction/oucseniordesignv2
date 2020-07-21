var LatLng = {lat: 28.6024, lng: -81.2};
var map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15, //street level zoom
  mapTypeId: 'satellite', //satellite style map
  center: LatLng, //currently hardcoded over ucf should be able to pass variable to this
  scaleControl: true
});

var marker = new google.maps.Marker({
  position: LatLng,
  map: map
});
