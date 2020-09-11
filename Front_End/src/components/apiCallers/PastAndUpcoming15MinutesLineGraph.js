import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

//import "../../stylesheets/dataTables.css";

class PastAndUpcoming15MinutesLineGraph extends Component {
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
        
        fetch("http://localhost:3000/predictionsData/getPastAndUpcoming15Minutes")
            .then(response => response.json())
            .then(res => this.setState({apiResponse: res, isLoading: false}))
            .catch(err => this.setState({hasError:true, error:err}));
    
    }
    
    componentDidMount() {
        this.callAPI();
    }
    
    render() {    
        if (this.state.hasError) {
            console.log(this.state.error);
            return <p>Error: <p>{this.state.error.message}</p></p>;
        }
        
        if (this.state.isLoading) {
            return <p>Loading Prediction Data...</p>;
        }
        
        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }
        
        return ( 
            <div id="RetrievedWeatherData">
                
            </div>
        );
    }
}

export default PastAndUpcoming15MinutesLineGraph;
