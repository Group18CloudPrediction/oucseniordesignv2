//
// This is probably the most simple apiCaller component in the project
// It retrieves the most recent entry in the database's cloudCoveragePercentage
// table (see the api documentation for details) and displays it on a single line
// It also displays text for when it's waiting on the api to respond, error messages
// and other messages.
//


import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

class CloudCoveragePercentage extends Component {
    constructor(props) {
        super(props);
        
        // set up the state variables we'll be needing to track
        // our call to the api
        this.state = { 
            apiResponse: "", 
            isLoading:true,
            hasError: false,
            error: null
        };
    }
    
    // retrieves data from the api
    callAPI() {
        // this will allow us to display to the user that this component is currently loading
        this.setState({isLoading: true});
        
        // build the url that the api call is located at / the request
        // will be sent to.
        
        const baseURL = require("./_apiRootAddress").url;
        
        var reqURL = baseURL + "/cloudCoverageData/" + this.props.stationID + "/mostrecent";
        
        // can call the api with a POST or a GET request. We were having
        // issues using a GET request, even though that was the more
        // appropriate request type. Oh well, this was our fix for that.
        
        // both of these fetch calls do exactly the same thing, just one
        // pretends to be a POST request
        if (!this.props.postReq)
        {
            fetch(reqURL)
                .then (response => response.json()                                     )
                .then (res      => this.setState({apiResponse: res, isLoading: false}) )
                .catch(err      => this.setState({hasError:true, error:err})           );
        }
        else
        {
            fetch(reqURL , {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: "{}"
                })
                .then (response => response.json()                                     )
                .then (res      => this.setState({apiResponse: res, isLoading: false}) )
                .catch(err      => this.setState({hasError:true, error:err})           );
        }
    }
    
    // gets called whenever the parent component refreshes
    componentDidMount() {
        this.callAPI();
    }
    
    render() {  
        // display various messages depending on the component's state
        if (this.props.stationID == null) {
            return (<span><em>Error: no stationID specified</em></span>);
        }
        
        if (this.state.hasError) {
            return (<em>Error: {this.state.error.message}</em>);
        }
        
        if (this.state.isLoading) {
            return (<em>Loading ...</em>);
        }
        
        if (!this.state.apiResponse || !this.state.apiResponse.data) {
            return (<em>Recieved bad response</em>);
        }
        
        if (!this.state.apiResponse.data[0]) {
            return (<em>No data for this substation</em>);
        }
        
        // Great! We have actual data to display.
        // the api will respond to us with a json object that contains a few
        // fields, but most importantly, the field "data", which will be 
        // an array with only one element. That element will itself be
        // a json object with a few fields, but "cloud_coverage" is the only 
        // one we care about. As mentioned in the api documentation, "cloud_coverage"
        // will be a floating point number such that a value of 12.5 represents
        // a coverage of %12.5
        return (<span> {this.state.apiResponse.data[0].cloud_coverage}% </span>);
    }
    
}

export default CloudCoveragePercentage;
