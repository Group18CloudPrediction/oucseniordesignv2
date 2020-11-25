//
// This component used to be a lot more complex, but now it just
// serves as a host for the RetrieveTargetedWeatherData component
// 
// Its real job is to be the home component for the Archive page.
// If any more archive components are set up (eg for power predictions), 
// they'll be hosted here.
//

import React, {Component} from "react";
import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData.js";
import MostRecentWeather from "./apiCallers/MostRecentWeather.js";

class Archive extends Component {
    render() {
        
        // example use of RetrieveTargetedWeatherData when you want to show a specific set of data
        // <RetrieveTargetedWeatherData stationID="PLACEHOLDER_REPLACE" onlyMostRecent={5} skipForm={true}/>
        
        // simply displays a default RetrieveTargetedWeatherData, along with a title.
        return ( 
            <div id="Archive">
                <h1> Archive page </h1> 
                <RetrieveTargetedWeatherData/>
            </div>
        );
    }
}

export default Archive;
