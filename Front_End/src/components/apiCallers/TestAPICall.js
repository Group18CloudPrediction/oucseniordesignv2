import React, {Component} from "react";

class TestAPICall extends Component {
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
            <div id="TestAPICall">
                {this.state.apiResponse}
            </div>
        );
    }
}

export default TestAPICall;
