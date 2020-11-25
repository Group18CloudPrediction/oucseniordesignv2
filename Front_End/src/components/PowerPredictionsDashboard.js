//
// This component hosts the OfficialPredictionsLineGraph component
// it used to host more components, but their functionality has since
// been rolled into OfficialPredictionsLineGraph
//
// It now only serves as a sort of homepage for the power predictions
//

import React, {Component} from "react";
//import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph";
//import ValidatePredictionsBarChart from "./apiCallers/ValidatePredictionsBarChart";

import OfficialPredictionsLineGraph from "./apiCallers/OfficialPredictionsLineGraph";
//import { heroku } from "./apiCallers/_apiRootAddress"

import "../stylesheets/PowerPredictionDashboard.css"

class PowerPredictionsDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stationID: this.props.stationID || "1"
        };
    }

    render() {
        // this component only works if the stationID prop is passed
        if (!this.props.stationID) return (<div className="PowerPredictionsDashboard">JSX / HTML Error: no stationID specified</div>);
        
        // the below line was used for Upcoming15MinutesLineGraph
        //const IS_HEROUKU_BUILD = heroku;

        return (

            <div className="PowerPredictionsDashboard">
                <div className="LineGraphWrapper">
                    <h1> Power Predictions </h1>

                    {/*
                        old stuff for displaying the old power predictions line graph, replaced by OfficialPredictionsLineGraph
                        <Upcoming15MinutesLineGraph realTimeUpdates={true} useUTC={IS_HEROUKU_BUILD} stationID={this.state.stationID} year={2020} month={9} day={28} hour={14} minute={2} isEST={true} />
                    */}

                    <OfficialPredictionsLineGraph realTimeUpdates={true} stationID={this.state.stationID} clampAboveZero={true} lookbackDepth={20}/>
                </div>


                {/*
                Old stuff for displaying the old validation graph, replaced by OfficialPredictionsLineGraph
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
