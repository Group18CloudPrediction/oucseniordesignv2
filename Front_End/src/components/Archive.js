import React, {Component} from "react";
import RetrieveWeatherData from "./RetrieveWeatherData.js";

class Archive extends Component {
    render() {
        return ( 
            <div id="Archive">
                <h1> Archive page </h1> 
                <RetrieveWeatherData/>
            </div>
        );
    }
}

export default Archive;
