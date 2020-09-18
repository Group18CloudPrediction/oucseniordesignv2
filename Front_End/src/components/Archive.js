import React, {Component} from "react";
import RetrieveWeatherData from "./apiCallers/RetrieveWeatherData.js";
// import TestAPICall from "./apiCallers/TestAPICall";

class Archive extends Component {
    render() {
        
        // <RetrieveWeatherData stationID="PLACEHOLDER_REPLACE"/>
        
        return ( 
            <div id="Archive">
                <h1> Archive page </h1> 
                <RetrieveWeatherData/>
            </div>
        );
    }
}

export default Archive;
