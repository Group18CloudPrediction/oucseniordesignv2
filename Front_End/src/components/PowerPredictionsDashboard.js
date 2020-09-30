import React, {Component} from "react";
import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph";
import ValidatePredictionsBarChart from "./apiCallers/ValidatePredictionsBarChart";

class PowerPredictionsDashboard extends Component {
    render() {
        if (!this.props.stationID) return (<div id="Livestream">JSX / HTML Error: no stationID specified</div>);
        // const date = new Date();
        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={date.year} month={date.month} day={date.day} hour=[date.hour] minute={date.minute-1}/>

        // <Upcoming15MinutesLineGraph stationID="TEST_MANUAL_ENTRY" year={2020} month={9} day={14} hour={13} minute={0}/>

        const IS_HEROUKU_BUILD = false;

        return (

            <div id="PowerPredictionsDashboard">
                <h1> Power Predictions </h1> 
                <Upcoming15MinutesLineGraph realTimeUpdates={true} useUTC={IS_HEROUKU_BUILD} stationID="TEST_ENTRY" year={2020} month={9} day={28} hour={14} minute={2} isEST={true}/>
                
                <h1> Power Prediction Average Accuracies </h1> 
                Calculated over the 10 most recent sets of predictions. <br/>
                <ValidatePredictionsBarChart stationID="TEST_ENTRY" overNMostRecent={10} year={2020} month={9} day={28} hour={14} minute={18}/>
            </div>
        );
    }
}

export default PowerPredictionsDashboard;

