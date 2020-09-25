import React, {Component} from "react";
import "./SubstationHomepage.css";
import GoogleMapReact from "google-map-react";

import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph"
import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData"
import SubstationLivestream from "./SubstationLivestream"


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
            <SubstationLivestream stationID={this.props.stationID}/>
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
            <Upcoming15MinutesLineGraph useUTC={IS_HEROUKU_BUILD} stationID={this.props.stationID} year={2020} month={9} day={14} hour={13} minute={0} isEST={true}/>
        </div>
        );
    }
}

export default SubstationHomepage;
