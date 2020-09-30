import React, {Component} from "react";
import "../stylesheets/SubstationHomepage.css";
import GoogleMapReact from "google-map-react";

import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData"
import SubstationLivestream from "./SubstationLivestream"
import PowerPredictionsDashboard from "./PowerPredictionsDashboard.js";


const IS_HEROUKU_BUILD = false;

class SubstationHomepage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    static defaultProps = {
        center: {
          lat: 59.95,
          lng: 30.33
        },
        zoom: 11,
        options: {
            streetViewControl: true,
            mapTypeControl: true,
        }
      };
    render() {

        return (
        <div className="SubstationHomepage">
            <h1>Substation {this.props.stationID}</h1>
            
            <div className="topdisplay">
            
                <div>
                    <SubstationLivestream stationID={this.props.stationID}/>
                    <PowerPredictionsDashboard stationID={this.props.stationID}/>
                </div>
                
                <div className="subMap" style= {{ height: '92.5vh', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        options={this.props.options}
                    ></GoogleMapReact>
                </div>

            </div>
            
            <RetrieveTargetedWeatherData stationID={this.props.stationID} onlyMostRecent={5} skipForm={true}/>
        </div>
        );
    }
}

export default SubstationHomepage;
