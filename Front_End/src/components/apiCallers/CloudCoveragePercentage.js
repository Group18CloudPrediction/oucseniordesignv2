import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

class CloudCoveragePercentage extends Component {
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
        const baseURL = require("./_apiRootAddress");
        
        var reqURL = baseURL + "/cloudCoverageData/" + this.props.stationID + "/mostrecent";
            
        fetch(reqURL)
            .then (response => response.json()                                     )
            .then (res      => this.setState({apiResponse: res, isLoading: false}) )
            .catch(err      => this.setState({hasError:true, error:err})           );
    }
    
    componentDidMount() {
        this.callAPI();
    }
    
    render() {  
        if (this.props.stationID == null) {
            return (<span><em>Error: no stationID specified</em></span>);
        }
        
        if (this.state.hasError) {
            return (<em>Error: {this.state.error.message}</em>);
        }
        
        if (this.state.isLoading) {
            return (<em>Loading ...</em>);
        }
        
        if (!this.state.apiResponse.data) {
            return (<em>Recieved bad response</em>);
        }
        
        if (!this.state.apiResponse.data[0]) {
            return (<em>No data for this substation</em>);
        }
        
        return (<span> {this.state.apiResponse.data[0].cloud_coverage}% </span>);
    }
    
}

export default CloudCoveragePercentage;
