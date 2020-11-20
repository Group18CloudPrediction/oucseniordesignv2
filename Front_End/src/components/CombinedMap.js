// Import
import React, { Component } from 'react';
import L from 'leaflet';
import { subscribeToCoverage, subscribeToShadow } from '../api';
import SunCalc from 'suncalc';
import { useHistory } from 'react-router-dom';
import { url } from './apiCallers/_apiRootAddress';

// Calib is an array of the dimensions of whatever was used to calibrate the camera.
// In our case, we used a square sheet of paper that's 210mmx210mm and was held at
// 75mm away from the lens
const CALIB  = [0.6883333, 0.6883333, 1/6];

// lat/long coordinates of the center of the image. i.e. wherever the camera is placed
// const CENTER = [28.4294, -81.309];
// In our case the center is the average of the long lats for the substations
const CENTER = [28.2367025, -81.23375]


// Set substation lat longs
const sub28 = [28.29172, -81.19373]
const sub27 = [28.24917, -81.28942]
const sub29 = [28.22465, -81.17819]
const sub33 = [28.18127, -81.27366]

// Class
class Map extends Component {
  constructor(props) {
    super(props);

    // TODO
    subscribeToCoverage((err, coverage_img) => {
      // If already exists, update the coverage image
      if (!(this.coverageOverlay === undefined)) {
        this.coverageOverlay.setUrl(coverage_img);
      }
    });

    subscribeToShadow((err, shadow_img) => {
      // If already exists, update the shadow image
      if (!(this.shadowOverlay === undefined)) {
        this.shadowOverlay.setUrl(shadow_img);
      }
    });
  }
  // TODO REMOVE
  state = {
    cloud_base_height: -1
  };
  // TODO GET CLOUD BASE HEIGHT IN HERE LIKE IN OTHER MAP
  // TODO DISPLAY ALL COVERAGES AND SHADOWS TO THIS MAP
  componentDidMount() {

    this.updateImageBounds();
    // var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    //       { maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'] }),
      var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
        // terrain   = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        //   { maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'] })
        terrain =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        })

    var baseMaps = {
        "Satellite": satellite,
        "Terrain": terrain,
    };

    // Create Map Object
    this.map = L.map('map', {
      center: CENTER,
      zoom: 13,
      layers: [ satellite, terrain ]
    });

    // Add Clouds and Shadows to the map
    this.shadowOverlay = L.imageOverlay('', [[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]]);
    this.shadowOverlay.addTo(this.map);

    this.coverageOverlay = L.imageOverlay('', [[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]]);
    this.coverageOverlay.addTo(this.map);

    var coverageBorderOptions = {
      "color": "#d35fb7",
      "weight": 2,
      "fill": false,
      "fillOpacity": .1
    };

    var shadowBorderOptions = {
      "color": "#fefe62",
      "weight": 2,
      "fill": false,
      "fillOpacity": .1
    };

    // Add borders to the map

    this.coverageBorder = L.rectangle([[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]], coverageBorderOptions)
    this.coverageBorder.addTo(this.map)

    this.shadowBorder = L.rectangle([[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]], shadowBorderOptions)
    this.shadowBorder.addTo(this.map)

    var overlayMaps = {
      "Shadow": this.shadowOverlay,
      "Shadow Bounds": this.shadowBorder,
      "Coverage": this.coverageOverlay,
      "Coverage Bounds": this.coverageBorder
    }

    // Add controls to map
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    // var north = L.control({position: "bottomright"});
    // north.onAdd = function(map) {
    //     var div = L.DomUtil.create("div", "info legend");
    //     div.innerHTML = '<img src="north_arrow.png">';
    //     return div;
    // }
    // north.addTo(this.map);

    const baseURL = url;
    // Add substation markers to map
    var marker27 = L.marker(sub27,
      {
        draggable: false,        // Make the icon dragable
        title: 'sub27'
      }).on('click', function(e) {window.location = baseURL + "/Sub/27"});
    marker27.addTo(this.map)
    var marker28 = L.marker(sub28,
      {
        draggable: false,        // Make the icon dragable
        title: 'sub28'
      }).on('click', function(e) {window.location = baseURL + "/Sub/28"});
    marker28.addTo(this.map)
    var marker29 = L.marker(sub29,
      {
        draggable: false,        // Make the icon dragable
        title: 'sub29'
      }).on('click', function(e) {window.location = baseURL + "/Sub/29"});
    marker29.addTo(this.map)
    var marker33 = L.marker(sub33,
      {
        draggable: false,        // Make the icon dragable
        title: 'sub33'
      }).on('click', function(e) {window.location = baseURL + "/Sub/33"});
    marker33.addTo(this.map)
    };


  // Render the following HTML
  render (){
    return (
      <div id="map" className="homeMap"style={{display:"flex", height:"100%", width: "100%"}}></div>
    );
  };

  // Input: Starting lat/long coordinate, North/South distance travlled, East/West distance.
  // Return: Final latitude value after travelling the input distance
  // Forumals: https://stackoverflow.com/questions/1253499/simple-calculations-for-working-with-lat-lon-and-km-distance
  addDistanceToCoordinate(startCoordinate, NSdistance, EWdistance, sun_altitude, azimuth, cbh, isShadow) {
    var finalCoordinate = [1e9, 1e9];
    var NSoffset = 0, EWoffset = 0;

    if (isShadow) {
      NSoffset = Math.cos(azimuth) * Math.tan(sun_altitude) * cbh;
      EWoffset = -Math.sin(azimuth) * Math.tan(sun_altitude) * cbh;
    }

    finalCoordinate[0] = startCoordinate[0] + ((EWdistance + NSoffset) / 362775.6);
    finalCoordinate[1] = startCoordinate[1] + ((NSdistance + EWoffset) /
                         365223.1) * Math.cos(startCoordinate[0] * Math.PI / 180);
    return finalCoordinate;
  }

  getImageBounds(isShadow) {
    // Returns a {azimuth, altitude} object. We're only interested in altitude
    // sun altitude above the horizon in radians, e.g. 0 at the horizon and PI/2 at the zenith (straight over your head)
    // Azimuth: 0 is south and Math.PI * 3/4 is northwest
    var sun = SunCalc.getPosition(new Date(), CENTER[0], CENTER[1]);

    // ===================================================================================
    // To avoid inflating this code with comments, check the final project design document
    // for a more detailed description that explains the logic behind this.
    var cloudHeight = this.state.cloud_base_height;
    var calibrationAngle = Math.atan(CALIB[0] / CALIB[1]);

    var smallHypo  = Math.sqrt(Math.pow(CALIB[0]/2, 2) + Math.pow(CALIB[1]/2, 2));
    var largeHypo  = smallHypo * cloudHeight / CALIB[2];
    var NSdistance = Math.cos(calibrationAngle) * largeHypo;
    var EWdistance = Math.sin(calibrationAngle) * largeHypo;

    var upperLeftCorner = this.addDistanceToCoordinate(CENTER, -NSdistance, EWdistance, sun.altitude,
                                                       sun.azimuth, cloudHeight, isShadow);

    var bottomRightCorner = this.addDistanceToCoordinate(CENTER, NSdistance, -EWdistance, sun.altitude,
                                                         sun.azimuth, cloudHeight, isShadow);
    // ===================================================================================

    // To be passed to Leaflet to be displayed onto the map
    return [upperLeftCorner, bottomRightCorner];
  }

  updateImageBounds() {
    // Zoom onto new bounds
    const coverageBounds = this.getImageBounds(false)
    const shadowBounds = this.getImageBounds(true)

    // If Coverage Overlay is available, recompute the bounds given new CBH
    if (!(this.coverageOverlay === undefined)) {
      this.coverageOverlay.setBounds(coverageBounds);
      this.coverageBorder.setBounds(coverageBounds);
    }

    // If Shadow Overlay is available, recompute the bounds given new CBH
    if (!(this.shadowOverlay === undefined)) {
      this.shadowOverlay.setBounds(shadowBounds);
      this.shadowBorder.setBounds(shadowBounds);
    }
  }
}

export default Map;
