import React, {Component} from "react";
import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph";

class PowerPredictionsDashboard extends Component {
    render() {
        
        // const date = new Date();
        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={date.year} month={date.month} day={date.day} hour=[date.hour] minute={date.minute-1}/>
        
        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={2020} month={9} day={14} hour={13} minute={0}/>
        return ( 
            <div id="PowerPredictionsDashboard">
                <h1> Power Predictions </h1> 
                <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={2020} month={9} day={14} hour={13} minute={0}/>
            </div>
        );
    }
}

export default PowerPredictionsDashboard;
