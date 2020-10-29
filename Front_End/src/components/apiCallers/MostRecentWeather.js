import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import "../../stylesheets/dataTables.css";
import DisplayWeatherData from "../miniComponents/DisplayWeatherData.js";
import DisplayWeatherDataFriendly from "../miniComponents/DisplayWeatherDataFriendly.js";

class MostRecentWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            isLoading:true,
            hasError: false,
            error: null
        };

        if (!this.props.stationID)
            this.setState({error: {message: "This component is missing a required prop: stationID"}});
    }

    callAPI() {
        this.setState({isLoading: true});

        // this component works whether a station id is passed or not
        const baseURL = process.env.Server || require("./_apiRootAddress");

        var postReqParams = {
            stationID: this.props.stationID,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            onlyMostRecent: 1
        }

        var postReqURL = baseURL + "/weatherData/" + this.props.stationID;

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

    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        if (this.state.hasError) {
            return <div>Error: <p>{this.state.error.message}</p></div>;
        }

        if (this.state.isLoading) {
            return <p>Loading Weather Data...</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }

        console.log(this.state.apiResponse.data);

        if (this.props.displayFullData)
        {
            return (
                <DisplayWeatherData apiResponseData={this.state.apiResponse.data}/>
            );
        }
        else
        {
            return (
                <DisplayWeatherDataFriendly apiResponseData={this.state.apiResponse.data}/>
            );
        }
    }

}

export default MostRecentWeather;
