//
// This component is basically a frontend counterpart to the API's retrieveTargeted function
// it takes the post req parameters as props, and all are optional. This allows us to 
// retrieve specific data (for example the weather stats card on the home page), or
// present a form to the user to allow them to select the data that they want.
//
// note: I made up the standards for API Caller stuff. API Caller is a term I use to refer to 
// components in the apiCallers folder of our project
//
// ======== 
// LIST OF PROPS:
// ========
// isEST          -- not used anymore
//
// REQUEST-RELATED PROPS:
// stationID       -- self-explanatory, see the weather data api for any questions
// startDate       -- self-explanatory, see the weather data api for any questions
// startTime       -- self-explanatory, see the weather data api for any questions
// endDate         -- self-explanatory, see the weather data api for any questions
// endTime         -- self-explanatory, see the weather data api for any questions
// onlyMostRecent  -- set this prop to an integer value to request only the most recent {that number} number of entries in the WeatherData database table
//                    note: THIS PROP IS REQUIRED TO ENABLE AUTOMATIC DATA REFRESH
//
// OTHER PROPS:
// friendlyDisplay -- displays the results using the DisplayWeatherDataFriendly component instead of the standard table
// skipForm        -- forces component to NOT display the form
//                    note: any props passed in will cause that field of the form to be non-editable
// disableRefresh  -- by default, this component will try to ping the web API for new data every minute. setting this prop to {true} will disable that entirely
//                    note: if onlyMostRecent is not set, refresh will be disabled anyway
//

import React, {Component} from "react";
import { url } from "./_apiRootAddress";

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
        
        // set up the state variables we need
        // note: this also shows what props this component supports
        this.state = {
            utcOffset: this.props.isEST? -4: 0,

            // remember our request parameters in case we want to refresh our data
            request_stationID: this.props.stationID || null,
            request_startDate: this.props.startDate || null,
            request_startTime: this.props.startTime ||null,
            request_endDate: this.props.endDate || null,
            request_endTime: this.props.endTime || null,

            // this doesn't need to be a state variable, but when I started the project, I liked having
            // all my props as state variables, but then I got lazy. This is left over from before I got lazy.
            friendlyDisplay: this.props.friendlyDisplay || false,

            // standard APICaller component state values
            apiResponse: "",
            hasSubmitted: (this.props.skipForm? true : false),
            isLoading: true,
            hasError: false,
            error: null
        };

        // setting up events for the form to be use
        this.setStationID = event => {
            if (!this.props.stationID)
                this.setState({ request_stationID: event.target.value })
        }

        this.handleSubmit = (event) => {
            if (event)
                event.preventDefault();

            if (!this.props.skipForm) {
                // here's where we display the warning if too much data is requested
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

        // set up event for the interval to use (React built-in feature allowing a component to refresh itself every so often)
        this.refreshData = () => {
            this.callAPI();
        }

        // obey the skipForm prop
        if (this.props.skipForm)
            this.handleSubmit();
    }

    // standard API Caller POST request version
    // note: I made up the standards for API Caller stuff. API Caller is a term I use to refer to 
    // components in the apiCallers folder of our project
    callAPI() {
        this.setState({isLoading: true});

        // this component works whether a station id is passed or not
        if (this.state.stationID === "")
            this.setState({staionID: null});

        const params = (!this.state.request_stationID ? "" : this.state.request_stationID);
        const baseURL = url;

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

        // eg:
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

    // once the page has been set up, if we're allowed to set up automatic data refresh, do it
    // setInterval(f, t) is a built-in React function that calls the function f every t milliseconds
    componentDidMount() {
        if(this.props.onlyMostRecent && !this.props.disableRefresh)
        {
            console.log("setting interval - RetrieveTargetedWeatherData");
            this.interval = setInterval(this.refreshData, 60*1000);
        }
    }

    // this function exists because there's no easy way to put an if statement inside jsx without
    // defining an entire function for it.
    //
    // this function returns some html if onlyMostRecent is set, otherwise it returns essentially nothing
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

    // fairly standard apiCaller render function
    // the form is a special addition though
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
            // the only thing really special here that you'll want to pay attention to is that I tied the 
            // values of the input fields to the state variables they represent, eg:
            //       value={this.state.request_endDate || ""}   onChange={e => this.setState({ request_endDate:   e.target.value })}
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

        if (!this.state.apiResponse.data[0]) {
            return <p>No data found for station {this.state.request_stationID}</p>;
        }

        // display the results in one of two child components, based on the value of the friendlyDisplay prop
        if (this.state.friendlyDisplay)
        {
            return (
                <DisplayWeatherDataFriendly stationID={this.state.request_stationID} apiResponseData={this.state.apiResponse.data}/>
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
