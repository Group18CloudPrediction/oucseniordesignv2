import React, {Component} from "react";
import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph";
import ValidatePredictionsBarChart from "./apiCallers/ValidatePredictionsBarChart";

import OfficialPredictionsLineGraph from "./apiCallers/OfficialPredictionsLineGraph";

import "../stylesheets/PowerPredictionDashboard.css"

class PowerPredictionsDashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            stationID: this.props.stationID || "TEST_ENTRY"
        };
    }
    
    render() {
        if (!this.props.stationID) return (<div id="Livestream">JSX / HTML Error: no stationID specified</div>);
        // const date = new Date();
        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={date.year} month={date.month} day={date.day} hour=[date.hour] minute={date.minute-1}/>

        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={2020} month={9} day={14} hour={13} minute={0}/>

        const IS_HEROUKU_BUILD = false;

        return (
            
            <div className="PowerPredictionsDashboard">
                <div className="LineGraphWrapper">
                    {/*<h1> Power Predictions </h1>*/} 
                    <h1> Power Predictions </h1>
                    
                    {/*<Upcoming15MinutesLineGraph realTimeUpdates={true} useUTC={IS_HEROUKU_BUILD} stationID={this.state.stationID} year={2020} month={9} day={28} hour={14} minute={2} isEST={true} />*/}
                
                    <OfficialPredictionsLineGraph realTimeUpdates={true} stationID={"1"}/>
                </div>
                
                
                {/*
                <div className="ValidationWrapper">
                    <h1> Power Prediction Average Accuracies </h1> 
                    Calculated over the 10 most recent sets of predictions. <br/>
                    <ValidatePredictionsBarChart realTimeUpdates={true} stationID={this.state.stationID} overNMostRecent={10} year={2020} month={9} day={28} hour={14} minute={18}/>
                </div>
                */}
            </div>
        );
    }
}

export default PowerPredictionsDashboard;

