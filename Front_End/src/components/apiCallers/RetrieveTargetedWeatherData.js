import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import "../../stylesheets/dataTables.css";
import DisplayWeatherData from "../miniComponents/DisplayWeatherData.js";

class RetrieveTargetedWeatherData extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            utcOffset: this.props.isEST? -4: 0,
            
            request_stationID: this.props.stationID || null,
            request_startDate: null,
            request_startTime: null,
            request_endDate: null,
            request_endTime: null,
            
            apiResponse: "", 
            hasSubmitted: false,
            isLoading: true,
            hasError: false,
            error: null
        };
        
        this.setStationID = event => {
            if (!this.props.stationID)
                this.setState({ request_stationID: event.target.value })
        }
        
        this.handleSubmit = (event) => {
//             alert('A name was submitted: ' + this.state.request_stationID);
            event.preventDefault();
            this.callAPI();
        }
    }
    
    callAPI() {
        this.setState({isLoading: true});
        
        // this component works whether a station id is passed or not
        if (this.state.stationID === "")
            this.setState({staionID: null});
        
        const params = (!this.state.request_stationID ? "" : ":" + this.state.request_stationID);
        const baseURL = require("./_apiRootAddress");
        
        var postReqParams = {
            stationID: this.state.request_stationID,
            startDate: this.state.request_startDate,
            startTime: this.state.request_startTime,
            endDate: this.state.request_endDate,
            endTime: this.state.request_endTime,
            
            isEST: true
        }
        var postReqURL = baseURL + "/weatherData/" + params;
        
        console.log(postReqParams); 
        console.log("posting to: " + postReqURL);
            
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
    
    //componentDidMount() {
        //this.callAPI();
    //}
    
    render() {    
        if (this.state.hasError) {
            return <p>Error: <p>{this.state.error.message}</p></p>;
        }
        
        if (!this.state.hasSubmitted) {
            return ( 
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Station ID: <br/>
                        <input type="text" value={this.state.request_stationID || ""} onChange={this.setStationID} />        
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
                </form>);
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
        
        return ( 
            <DisplayWeatherData apiResponseData={this.state.apiResponse.data}/>
        );
    }
}

export default RetrieveTargetedWeatherData;
