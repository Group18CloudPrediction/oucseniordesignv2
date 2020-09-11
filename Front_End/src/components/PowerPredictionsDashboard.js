import React, {Component} from "react";
import PastAndUpcoming15MinutesLineGraph from "./apiCallers/PastAndUpcoming15MinutesLineGraph";

class PowerPredictionsDashboard extends Component {
    render() {
        return ( 
            <div id="PowerPredictionsDashboard">
                <h1> Power Predictions </h1> 
                <PastAndUpcoming15MinutesLineGraph/>
            </div>
        );
    }
}

export default PowerPredictionsDashboard;
