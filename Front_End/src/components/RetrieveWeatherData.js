import React, {Component} from "react";

class RetrieveWeatherData extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }
    
    callAPI() {
        fetch("http://localhost:3000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
            .catch(err => err);
    }
    
    componentWillMount() {
        this.callAPI();
    }
    
    render() {
        return ( 
            <div id="RetrievedWeatherData">
                {this.state.apiResponse}
            </div>
        );
    }
}

export default RetrieveWeatherData;
