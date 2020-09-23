import React, {Component} from "react";

import Upcoming15MinutesLineGraph from "./apiCallers/Upcoming15MinutesLineGraph"
import RetrieveTargetedWeatherData from "./apiCallers/RetrieveTargetedWeatherData"
import SubstationLivestream from "./SubstationLivestream"

const IS_HEROUKU_BUILD = false;

class SubstationHomepage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    
    render() {
        
        return ( 
        <div id={"HomepageForStation"+this.props.stationID}>
            <h1>Sub_{this.props.stationID}</h1>
            
            <SubstationLivestream stationID={this.props.stationID}/>
            <RetrieveTargetedWeatherData stationID={this.props.stationID} onlyMostRecent={5} skipForm={true}/>
            <Upcoming15MinutesLineGraph useUTC={IS_HEROUKU_BUILD} stationID={this.props.stationID} year={2020} month={9} day={14} hour={13} minute={0} isEST={true}/>
        </div>
        );
    }
}

export default SubstationHomepage;
