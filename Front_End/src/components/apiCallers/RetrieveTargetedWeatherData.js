import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import "../../stylesheets/dataTables.css";
import DisplayWeatherData from "../miniComponents/DisplayWeatherData.js";
import DisplayWeatherDataFriendly from "../miniComponents/DisplayWeatherDataFriendly.js";

// note: this component will automatically refresh if the onlyMostRecent prop is present and the disableRefresh prop is not
class RetrieveTargetedWeatherData extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            utcOffset: this.props.isEST? -4: 0,
            
            request_stationID: this.props.stationID || null,
            request_startDate: this.props.startDate || null,
            request_startTime: this.props.startTime ||null,
            request_endDate: this.props.endDate || null,
            request_endTime: this.props.endTime || null,
            
            friendlyDisplay: this.props.friendlyDisplay || false,
            
            apiResponse: "", 
            hasSubmitted: (this.props.skipForm? true : false),
            isLoading: true,
            hasError: false,
            error: null
        };
        
        this.setStationID = event => {
            if (!this.props.stationID)
                this.setState({ request_stationID: event.target.value })
        }
        
        this.handleSubmit = (event) => {
            if (event)
                event.preventDefault();
            
            if (!this.props.skipForm) {
                
                var proceed = true;
                const msPerDay = (1000*60*60*24)
                const minutesPerDay = 1440
                var dayRange = 0
                const unlimited = this.props.onlyMostRecent == null;
                
                if (unlimited && !this.state.request_startDate) {
                    proceed = window.confirm("You didn't enter a date range. THIS MAY REQUEST A LARGE AMOUNT OF DATA. Are you sure?") 
                } else if (!this.state.request_endDate) {
                    dayRange = Math.floor((new Date() - new Date(this.state.request_startDate)) / msPerDay);
                } else if (this.state.request_endDate >= this.state.request_startDate) {
                    dayRange = Math.floor((new Date(this.state.request_endDate) - new Date(this.state.request_startDate)) / msPerDay);
                } else {
                    alert('Invalid date range: The start date is after the end date.');
                    return;
                }
                
                if (unlimited && proceed && dayRange > 1) {
                    proceed = window.confirm("You requested "+dayRange+" days of data. This will request ~"+(minutesPerDay*dayRange)+" rows of data. Are you sure?") 
                }
                    
                if(!proceed) return;
            }
            
            this.callAPI();
        }
        
        this.refreshData = () => {
            this.callAPI();
        }
        
        if (this.props.skipForm)
            this.handleSubmit();
    }
    
    callAPI() {
        this.setState({isLoading: true});
        
        // this component works whether a station id is passed or not
        if (this.state.stationID === "")
            this.setState({staionID: null});
        
        const params = (!this.state.request_stationID ? "" : this.state.request_stationID);
        const baseURL = require("./_apiRootAddress");
        
        var postReqParams = {
            stationID: this.state.request_stationID,
            
            startDate: this.state.request_startDate,
            endDate: this.state.request_endDate,
            
            endTime: this.state.request_endTime,
            startTime: this.state.request_startTime,
            
            onlyMostRecent: this.props.onlyMostRecent,
            
            isEST: true
        }
        
        console.log(postReqParams);
        
        // https://localhost:3000/weatherData/1
        var postReqURL = baseURL + "/weatherData/" + params;
            
        fetch(postReqURL, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(postReqParams)
            })
            .then (response => response.json()                                     )
            .then (res      => this.setState({apiResponse: res, isLoading: false}) )
            .catch(err      => this.setState({hasError:true, error:err})           );
        
        this.setState({hasSubmitted: true});
    }
    
    componentDidMount() {
        if(this.props.onlyMostRecent && !this.props.disableRefresh)
        {
            console.log("setting interval - RetrieveTargetedWeatherData");
            this.interval = setInterval(this.refreshData, 60*1000);
        }
    }
    
    showDataLimitNotice() {
        if (this.props.onlyMostRecent) {
            return (
                <h4 className="dataLimitNotice">
                    {"This component is set up to only display the "} 
                    {this.props.onlyMostRecent}
                    {" most recent entries."}
                </h4>
            );
        }
        
        return ("");
    }
    
    render() {    
        if (this.state.hasError) {
            return <div>Error: <p>{this.state.error.message}</p></div>;
        }
        
        if (!this.state.hasSubmitted) {
            // I have to make a function for this because I can't put an if statement inside a jsx () object
            var makeStationInputField = () => {
                if (this.props.stationID == null)
                    return (<input type="text" value={this.state.request_stationID || ""} onChange={this.setStationID}/>)
                else
                    return (<input type="text" value={this.state.request_stationID || ""} onChange={this.setStationID} readonly="true"/>)
            }
            
            // the actual jsx for the form
            return ( 
                <div>
                    {this.showDataLimitNotice() }
                    {"Note: you can leave a field empty if you don't want to select against it."}
                    <br/>
                    {"Warning: Leaving the date fields empty will request a very large amount of data and may cause longer loading times"}
                    <br/>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Station ID: <br/>
                            {makeStationInputField()}
                            <br/>
                        </label>
                        
                        <br/>
                        
                        <table>
                            <tbody>
                                <tr>
                                    <td>Start Date</td>
                                    <td>End Date</td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="date" value={this.state.request_startDate || ""} onChange={e => this.setState({ request_startDate: e.target.value })} />        
                                    </td>
                                    <td>
                                        <input type="date" value={this.state.request_endDate || ""}   onChange={e => this.setState({ request_endDate:   e.target.value })} />        
                                    </td>
                                </tr>
                                <tr>
                                    <td>Start Time</td>
                                    <td>End Time</td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="time" value={this.state.request_startTime || ""} onChange={e => this.setState({ request_startTime: e.target.value })} />        
                                    </td>
                                    <td>
                                        <input type="time" value={this.state.request_endTime || ""}   onChange={e => this.setState({ request_endTime:   e.target.value })} />        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                </div>);
        }
        
        if (this.state.isLoading) {
            return <p>Loading Weather Data...</p>;
        }
        
        if (!this.state.apiResponse) {
            return <p>Internal Error: API Response was not recorded</p>;
        }
        
        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }
        
        if (this.state.friendlyDisplay)
        {
            return ( 
                <DisplayWeatherDataFriendly apiResponseData={this.state.apiResponse.data}/>
            );
        }
        else
        {
            return ( 
                <DisplayWeatherData apiResponseData={this.state.apiResponse.data}/>
            );
        }
        
    }
}

export default RetrieveTargetedWeatherData;
