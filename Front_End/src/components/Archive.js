import React, {Component} from "react";
// import RetrieveWeatherData from "./apiCallers/RetrieveWeatherData.js";
import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData.js";
// import TestAPICall from "./apiCallers/TestAPICall";
import MostRecentWeather from "./apiCallers/MostRecentWeather.js";

class Archive extends Component {
    render() {
        
        // <RetrieveTargetedWeatherData stationID="PLACEHOLDER_REPLACE" onlyMostRecent={5} skipForm={true}/>
        
        return ( 
            <div id="Archive">
                <h1> Archive page </h1> 
                <MostRecentWeather stationID={"PLACEHOLDER_REPLACE"}/>
                <RetrieveTargetedWeatherData/>
            </div>
        );
    }
}

export default Archive;
