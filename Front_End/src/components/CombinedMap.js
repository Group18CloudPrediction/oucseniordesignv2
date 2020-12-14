// Import
import React, { Component } from 'react';
import L from 'leaflet';
import { latLongs, subscribeToCoverage, subscribeToShadow, subscribeToCoverageN, subscribeToShadowN } from '../api';
import SunCalc from 'suncalc';
// import { useHistory } from 'react-router-dom';
import { url } from './apiCallers/_apiRootAddress';

// Calib is an array of the dimensions of whatever was used to calibrate the camera.
// In our case, we used a square sheet of paper that's 210mmx210mm and was held at
// 75mm away from the lens
const CALIB = [0.6883333, 0.6883333, 1 / 6];

// lat/long coordinates of the center of the image. i.e. wherever the camera is placed
// const CENTER = [28.4294, -81.309];
// In our case the center is the average of the long lats for the substations
const CENTER = latLongs["CENTER"];

// Class
class Map extends Component {
    constructor(props) {
        super(props);
        this.refreshData = () => {
            this.callAPI();
        };
        this.state = {
            apiResponse: "",
            hasSubmitted: (this.props.skipForm ? true : false),
            isLoading: true,
            hasError: false,
            error: null
        }

        this.callAPI();
        
        this.coverageOverlays = {};
        this.shadowOverlays = {};
        this.coverageBorders = {};
        this.shadowBorders = {};
        

        // TODO
        for (let stationID in latLongs) {
            subscribeToCoverageN(stationID, (err, coverage_img) => {

                // If already exists, update the coverage image

                // If Coverage Overlay is available, recompute the bounds given new CBH
                console.log("subscribe to coverage " + stationID);
                if (this.coverageOverlays[stationID]) {
                    console.log("Set Coverage");
                    this.coverageOverlays[stationID].setUrl(coverage_img);
                }


                console.log("cvg" + coverage_img);
            });

            subscribeToShadowN(stationID, (err, shadow_img) => {
                // If already exists, update the shadow image

                // If Shadow Overlay is available, recompute the bounds given new CBH
                if (this.shadowOverlays[stationID]) {
                    this.shadowOverlays[stationID].setUrl(shadow_img);
                }
                console.log("shdw" + shadow_img);
            });
        }
    }

    // Call API to our mongoDB to fetch weather stats
    callAPI() {
        console.log("I love this API");
        this.setState({
            isLoading: true
        });

        // this component works whether a station id is passed or not
        if (this.state.stationID === "")
            this.setState({
                staionID: null
            });

        const params = (!this.props.stationID ? "" : this.props.stationID);
        const baseURL = url;

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
            .then(response => response.json())
            .then(res => {
                this.setState({
                    apiResponse: res,
                    isLoading: false
                });
                this.updateImageBounds();
                console.log("Hello");
            })
            .catch(err => this.setState({
                hasError: true,
                error: err
            }));

        this.setState({
            hasSubmitted: true
        });
    }

    // Set an interval to clear memory cache
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    // TODO GET CLOUD BASE HEIGHT IN HERE LIKE IN OTHER MAP
    // TODO DISPLAY ALL COVERAGES AND SHADOWS TO THIS MAP
    componentDidMount() {
        // Set an interval to refresh data
        this.interval = setInterval(this.refreshData, 60 * 1000);

        this.updateImageBounds();
        // var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        //       { maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'] }),
        var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }),
            // terrain   = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
            //   { maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'] })
            terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            })

        var baseMaps = {
            "Satellite": satellite,
            "Terrain": terrain,
        };

        // Create Map Object
        this.map = L.map('map', {
            center: CENTER,
            zoom: 10,
            layers: [satellite, terrain]
        });

        // Add Clouds and Shadows to the map
        this.coverageOverlayLayerGroup = L.layerGroup();
        this.shadowOverlayLayerGroup = L.layerGroup();
        
        for (let stationID in latLongs) {
            this.shadowOverlays[stationID] = L.imageOverlay('', [
                [28.42000000001, -81.42000000001],
                [28.42000000002, -81.42000000002]
            ]);
            this.shadowOverlays[stationID].addTo(this.shadowOverlayLayerGroup);
            
            this.coverageOverlays[stationID] = L.imageOverlay('', [
                [28.42000000001, -81.42000000001],
                [28.42000000002, -81.42000000002]
            ]);
            this.coverageOverlays[stationID].addTo(this.coverageOverlayLayerGroup);
        }
        
        this.coverageOverlayLayerGroup.addTo(this.map);
        this.shadowOverlayLayerGroup.addTo(this.map);
        
        

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

        this.coverageBordersLayerGroup = L.layerGroup();
        this.shadowBordersLayerGroup = L.layerGroup();
        
        for (let stationID in latLongs) {
            let ll = latLongs[stationID];
            
            this.coverageBorders[stationID] = L.rectangle([
                [ll[0] + 28.42000000001, ll[1] - 81.42000000001],
                [ll[0] + 28.42000000002, ll[1] - 81.42000000002]
            ], coverageBorderOptions)
            this.coverageBorders[stationID].addTo(this.coverageBordersLayerGroup)

            this.shadowBorders[stationID] = L.rectangle([
                [ll[0] + 28.42000000001, ll[1] - 81.42000000001],
                [ll[0] + 28.42000000002, ll[1] - 81.42000000002]
            ], shadowBorderOptions)
            this.shadowBorders[stationID].addTo(this.shadowBordersLayerGroup)
        }

        this.coverageBordersLayerGroup.addTo(this.map);
        this.shadowBordersLayerGroup.addTo(this.map);
        

        

        var overlayMaps = {
            "Shadow": this.shadowOverlayLayerGroup,
            "Shadow Bounds": this.shadowBordersLayerGroup,
            "Coverage": this.coverageOverlayLayerGroup,
            "Coverage Bounds": this.coverageBordersLayerGroup
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
        for (let stationID in latLongs) {
            var stationMarker = L.marker(latLongs[stationID], {
                draggable: false, // Make the icon dragable
                title: 'Sub ' + stationID.substring(3)
            }).on('click', function(e) {
                window.location = baseURL + "/Sub/" + stationID.substring(3)
            });
            stationMarker.addTo(this.map);
        }

    }




    // Render the following HTML
    render() {
        return ( <div 
            id = "map"
            className = "homeMap"
            style = {
                {
                    display: "flex",
                    height: "100%",
                    width: "100%"
                }
            } > </div>
        );
    };

    // Input: Starting lat/long coordinate, North/South distance travlled, East/West distance.
    // Return: Final latitude value after travelling the input distance
    // Forumals: https://stackoverflow.com/questions/1253499/simple-calculations-for-working-with-lat-lon-and-km-distance
    addDistanceToCoordinate(startCoordinate, NSdistance, EWdistance, sun_altitude, azimuth, cbh, isShadow) {
        var finalCoordinate = [1e9, 1e9];
        var NSoffset = 0,
            EWoffset = 0;

        if (isShadow) {
            NSoffset = Math.cos(azimuth) * Math.tan(sun_altitude) * cbh;
            EWoffset = -Math.sin(azimuth) * Math.tan(sun_altitude) * cbh;
        }

        finalCoordinate[0] = startCoordinate[0] + ((EWdistance + NSoffset) / 362775.6);
        finalCoordinate[1] = startCoordinate[1] + ((NSdistance + EWoffset) /
            365223.1) * Math.cos(startCoordinate[0] * Math.PI / 180);
        return finalCoordinate;
    }

    getImageBounds(isShadow, center) {
        // Returns a {azimuth, altitude} object. We're only interested in altitude
        // sun altitude above the horizon in radians, e.g. 0 at the horizon and PI/2 at the zenith (straight over your head)
        // Azimuth: 0 is south and Math.PI * 3/4 is northwest
        const round = (number, decimalPlaces) => {
            if (isNaN(number)) return "NaN";

            const factorOfTen = Math.pow(10, decimalPlaces)
            var retval = (Math.round(number * factorOfTen) / factorOfTen)

            return retval + "";
        }
        var sun = SunCalc.getPosition(new Date(), center[0], center[1]);

        // ===================================================================================
        // To avoid inflating this code with comments, check the final project design document
        // for a more detailed description that explains the logic behind this.
        var cloudHeight;
        if (!(typeof(this.state.apiResponse) === 'undefined') && this.state.apiResponse != null && !(typeof(this.state.apiResponse.data) === 'undefined')) {
            console.log("if");
            var dataPoint = this.state.apiResponse.data[0];
            cloudHeight = round((1000 * (round(dataPoint.airT_C, 3) - (round(dataPoint.airT_C, 3) - (((100 - round(dataPoint.rh, 3)) / 5))))) / 4.4, 3);
        } else {
            console.log("else");
            cloudHeight = 2000;
        }
        console.log(this.state.apiResponse);
        console.log("cloudHeight " + cloudHeight + this.state.apiResponse + "!");

        var calibrationAngle = Math.atan(CALIB[0] / CALIB[1]);


        var smallHypo = Math.sqrt(Math.pow(CALIB[0] / 2, 2) + Math.pow(CALIB[1] / 2, 2));
        var largeHypo = smallHypo * cloudHeight / CALIB[2];
        var NSdistance = Math.cos(calibrationAngle) * largeHypo;
        var EWdistance = Math.sin(calibrationAngle) * largeHypo;

        var upperLeftCorner = this.addDistanceToCoordinate(center, -NSdistance, EWdistance, sun.altitude,
            sun.azimuth, cloudHeight, isShadow);

        var bottomRightCorner = this.addDistanceToCoordinate(center, NSdistance, -EWdistance, sun.altitude,
            sun.azimuth, cloudHeight, isShadow);
        // ===================================================================================

        // To be passed to Leaflet to be displayed onto the map
        return [upperLeftCorner, bottomRightCorner];
    }

    updateImageBounds() {
        for (let stationID in latLongs) {
            let ll = latLongs[stationID];
            
            // Zoom onto new bounds
            const coverageBounds = this.getImageBounds(false, ll)
            const shadowBounds = this.getImageBounds(true, ll)

            // If Coverage Overlay is available, recompute the bounds given new CBH
            if (!(this.coverageOverlays[stationID] === undefined)) {
                this.coverageOverlays[stationID].setBounds(coverageBounds);
                this.coverageBorders[stationID].setBounds(coverageBounds);
            }

            // If Shadow Overlay is available, recompute the bounds given new CBH
            if (!(this.shadowOverlays[stationID] === undefined)) {
                this.shadowOverlays[stationID].setBounds(shadowBounds);
                this.shadowBorders[stationID].setBounds(shadowBounds);
            }
        }
    }
}

export default Map;
