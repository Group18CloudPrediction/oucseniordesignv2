//
// I believe this component is outdated and safe to delete
// it simply displays all weather data in the database
//

import React, {Component} from "react";
import { url } from "./_apiRootAddress";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import "../../stylesheets/dataTables.css";
import DisplayWeatherData from "../miniComponents/DisplayWeatherData.js";

class RetrieveWeatherData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            isLoading:true,
            hasError: false,
            error: null
        };
    }

    callAPI() {
        this.setState({isLoading: true});

        // this component works whether a station id is passed or not
        const params = (!this.props.stationID ? "" : ":" + this.props.stationID + "/") + "getall";
        const baseURL = url;

        fetch(baseURL + "/weatherData/" + params)
            .then(response => response.json())
            .then(res => this.setState({apiResponse: res, isLoading: false}))
            .catch(err => this.setState({hasError:true, error:err}));

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

        return (
            <DisplayWeatherData apiResponseData={this.state.apiResponse.data}/>
        );
    }

}

export default RetrieveWeatherData;
