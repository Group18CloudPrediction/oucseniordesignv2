import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg



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
        
        fetch("http://localhost:3000/weatherData/getall")
            .then(response => response.json())
            .then(res => this.setState({apiResponse: res, isLoading: false}))
            .catch(err => this.setState({hasError:true, error:err}));
    
    }
    
    componentDidMount() {
        this.callAPI();
    }
    
    render() {    
        if (this.state.hasError) {
            return <p>Error: <p>{this.state.error}</p></p>;
        }
        
        if (this.state.isLoading) {
            return <p>Loading Weather Data...</p>;
        }
        
        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }
        
        return ( 
            <div id="RetrievedWeatherData">
                <table class="dataTable" id="weatherDataTable">
                    <thead>
                        <tr>
                            <th>_id</th>
                            <th>author</th>
                            <th>slrFD_W</th>
                            <th>rain_mm</th>
                            <th>strikes</th>
                            <th>dist_km</th>
                            <th>ws_ms</th>
                            <th>windDir</th>
                            <th>maxWS_ms</th>
                            <th>airT_C</th>
                            <th>vp_mmHg</th>
                            <th>bp_mmHg</th>
                            <th>rh</th>
                            <th>rht_c</th>
                            <th>tiltNS_deg</th>
                            <th>tiltWE_deg</th>
                            <th>date</th>
                            <th>date_mins_only</th>
                            <th>system_num</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable(this.state.apiResponse.data)}
                    </tbody>
                </table>
            </div>
        );
    }
    
    renderTable(data) {
        return data.map((dataPoint, index) => {
            return(
                <tr key={dataPoint._id}>
                    <td>{dataPoint._id}</td>
                    <td>{dataPoint.author}</td>
                    <td>{dataPoint.slrFD_W}</td>
                    <td>{dataPoint.rain_mm}</td>
                    <td>{dataPoint.strikes}</td>
                    <td>{dataPoint.dist_km}</td>
                    <td>{dataPoint.ws_ms}</td>
                    <td>{dataPoint.windDir}</td>
                    <td>{dataPoint.maxWS_ms}</td>
                    <td>{dataPoint.airT_C}</td>
                    <td>{dataPoint.vp_mmHg}</td>
                    <td>{dataPoint.bp_mmHg}</td>
                    <td>{dataPoint.rh}</td>
                    <td>{dataPoint.rht_c}</td>
                    <td>{dataPoint.tiltNS_deg}</td>
                    <td>{dataPoint.tiltWE_deg}</td>
                    <td>{dataPoint.date}</td>
                    <td>{dataPoint.date_mins_only}</td>
                    <td>{dataPoint.system_num}</td>
                </tr>
            );
        })
    }
}

export default RetrieveWeatherData;
