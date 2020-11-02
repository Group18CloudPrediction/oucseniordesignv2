// Import
import React, { Component } from 'react';
import L from 'leaflet';
import { initializeSubstation, subscribeToCoverage, subscribeToShadow, } from '../api';
import SunCalc from 'suncalc';



// TODO set map to display at location of stationID


// Calib is an array of the dimensions of whatever was used to calibrate the camera.
// In our case, we used a square sheet of paper that's 210mmx210mm and was held at
// 75mm away from the lens
const CALIB  = [0.6883333, 0.6883333, 1/6];

// lat/long coordinates of the center of the image. i.e. wherever the camera is placed
// In our case the center is the average of the long lats for the substations
let CENTER = [28.2367025, -81.23375]
const sub28 = [28.29172, -81.19373]
const sub27 = [28.24917, -81.28942]
const sub29 = [28.22465, -81.17819]
const sub33 = [28.18127, -81.27366]


// Class
class Map extends Component {
  constructor(props) {
    super(props);
    this.refreshData = () => {
      this.callAPI(); 
    };
    this.state = {apiResponse: "",
    hasSubmitted: (this.props.skipForm? true : false),
    isLoading: true,
    hasError: false,
    error: null}
    this.callAPI();

    initializeSubstation(this.props.stationID);
    
    subscribeToCoverage((err, coverage_img) => {
      // If already exists, update the coverage image

      // If Coverage Overlay is available, recompute the bounds given new CBH
      if (!(this.coverageOverlay === undefined)) {
        this.coverageOverlay.setUrl(coverage_img);
      }
    
      console.log("cvg" + coverage_img);
    });

    subscribeToShadow((err, shadow_img) => {
      // If already exists, update the shadow image
      
      // If Shadow Overlay is available, recompute the bounds given new CBH
      if (!(this.shadowOverlay === undefined)) {
        this.shadowOverlay.setUrl(shadow_img);
      }
      console.log("shdw" + shadow_img);
    });
  }

  // Call API to our mongoDB to fetch weather stats
  callAPI() {
    console.log("I love this API");
    this.setState({isLoading: true});

    // this component works whether a station id is passed or not
    if (this.state.stationID === "")
        this.setState({staionID: null});

    const params = (!this.props.stationID ? "" : this.props.stationID);
    const baseURL = process.env.Server || "http://localhost:3000"

    var postReqParams = {
        stationID: this.props.stationID,
        onlyMostRecent: 1
    }

    console.log(postReqParams);

    var postReqURL = baseURL + "/weatherData/" + params;

    fetch(postReqURL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(postReqParams)
        })
        .then (response => response.json()                                     )
        .then (res      => {this.setState({apiResponse: res, isLoading: false}); this.updateImageBounds(); console.log("Hello");})
        .catch(err      => this.setState({hasError:true, error:err})           );

    this.setState({hasSubmitted: true});
  }

  // Set an interval to clear memory cache
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // On Mount
  componentDidMount() {
    
    // Set an interval to refresh data
    this.interval = setInterval(this.refreshData, 60*1000);

    // Call function to update the bounds
    this.updateImageBounds();


    // The following is used to set parameters for our leaflet map
    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    terrain =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    });

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
    
    // Create Image Overlay Options
    this.shadowOverlay = L.imageOverlay('', [[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]]);
    this.shadowOverlay.addTo(this.map);
    
    // Create Image Overlay Options
    this.coverageOverlay = L.imageOverlay('', [[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]]);
    this.coverageOverlay.addTo(this.map);
    
    // Set Border Options for coverage
    var coverageBorderOptions = {
      "color": "#d35fb7",
      "weight": 2,
      "fill": false,
      "fillOpacity": .1
    };
    
    // Set Border Options for shadow
    var shadowBorderOptions = {
      "color": "#fefe62",
      "weight": 2,
      "fill": false,
      "fillOpacity": .1
    };
      
    // Set Coverage Border and add it to the map
    this.coverageBorder = L.rectangle([[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]], coverageBorderOptions)
    this.coverageBorder.addTo(this.map)

    // Set Shadow Border and add it to the map
    this.shadowBorder = L.rectangle([[28.42000000001, -81.42000000001], [28.42000000002, -81.42000000002]], shadowBorderOptions)
    this.shadowBorder.addTo(this.map)

    var overlayMaps = {
      "Shadow": this.shadowOverlay,
      "Shadow Bounds": this.shadowBorder,
      "Coverage": this.coverageOverlay,
      "Coverage Bounds": this.coverageBorder
    }

    // Add controls to the map
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    // Add marker at center to map
    var marker = L.marker(CENTER,
      {
        draggable: false,        // Make the icon dragable
        title: 'Camera Position'
      });
    marker.addTo(this.map)
  };

  // Render the following HTML
  render (){
    console.log("ERROR " + this.state.error);
    return (
      <div className="localDiv" style={{display:"flex", height:"100%", width: "100%"}}>
        <div id="map" className="localMap"style={{display:"flex", height:"98%", width: "98%"}}></div>
      </div>
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
    const round = (number, decimalPlaces) => {
      if (isNaN(number)) return "NaN";
      
      const factorOfTen = Math.pow(10, decimalPlaces)
      var retval = (Math.round(number * factorOfTen) / factorOfTen)
      
      return retval+"";
    }
    var sun = SunCalc.getPosition(new Date(), CENTER[0], CENTER[1]);

    // ===================================================================================
    // To avoid inflating this code with comments, check the final project design document
    // for a more detailed description that explains the logic behind this.
    var cloudHeight;
    if(!(typeof(this.state.apiResponse) === 'undefined') && this.state.apiResponse != null && !(typeof(this.state.apiResponse.data) === 'undefined')){
      console.log("if");
      var dataPoint = this.state.apiResponse.data[0];
      cloudHeight = round((1000 * (round(dataPoint.airT_C, 3) - (round(dataPoint.airT_C, 3) - (((100 - round(dataPoint.rh, 3))/5)))))/4.4, 3);
    } else{
      console.log("else");
      cloudHeight = 2000;
    }
    console.log(this.state.apiResponse);
    console.log("cloudHeight " + cloudHeight + this.state.apiResponse + "!");
    
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