import React, {Component} from "react";
// import RetrieveWeatherData from "./apiCallers/RetrieveWeatherData.js";
import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData.js";
// import TestAPICall from "./apiCallers/TestAPICall";

class Archive extends Component {
    render() {
        
        // <RetrieveWeatherData stationID="PLACEHOLDER_REPLACE" onlyMostRecent={5}/>
        
        return ( 
            <div id="Archive">
                <h1> Archive page </h1> 
                <RetrieveTargetedWeatherData/>
            </div>
        );
    }
}

export default Archive;
