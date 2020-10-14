import React, {Component} from "react";
import "../stylesheets/SubstationHomepage.css";
import GoogleMapReact from "google-map-react";

import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData"
import SubstationLivestream from "./SubstationLivestream"

import PowerPredictionsDashboard from "./PowerPredictionsDashboard.js";


const IS_HEROUKU_BUILD = false;

class SubstationHomepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            testMode: (this.props.stationID == "-1")
        };
    }
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
            {/*<h1>Substation {this.props.stationID}</h1>*/}


            <div className="topdisplay">

                <div className="leftdisplay">
                    <div className="LivestreamWrapper">

                        <SubstationLivestream stationID={this.props.stationID}/>
                    </div>

                    <div className="subMap" style= {{ height: '40vh', width: '640px' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
                            defaultCenter={this.props.center}
                            defaultZoom={this.props.zoom}
                            options={this.props.options}
                        ></GoogleMapReact>
                    </div>

                    
                </div>
                
                <div className="rightdisplay">
                    <PowerPredictionsDashboard stationID={this.state.testMode? "TEST_ENTRY" : this.props.stationID}/>
                    <div>
                        <h1>Weather Statistics</h1>
                        <RetrieveTargetedWeatherData friendlyDisplay={true} stationID={this.state.testMode? "1" : this.props.stationID} onlyMostRecent={1} skipForm={true}/>
                    </div>
                    
                    {
//                     <div>
//                         <h1>Weather Statistics</h1>
//                         <p>Coverage Percentage: </p>
//                         <p>Wind Direction: </p>
//                         <p>Wind Speed: </p>
//                         <p>Relative Humidity: </p>
//                         <p>Barametric Pressure: </p>
//                         <p>Volumetric Pressure: </p>
//                     </div>
                    }
                    
                </div>


            </div>

            

            
            {/*<RetrieveTargetedWeatherData stationID={this.state.testMode? "1" : this.props.stationID} onlyMostRecent={5} skipForm={true}/>*/}
        </div>
        );
    }
}

export default SubstationHomepage;
