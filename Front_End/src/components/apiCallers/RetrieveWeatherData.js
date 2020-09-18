import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data
// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import "../../stylesheets/dataTables.css";

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

        fetch("https://cloudtracking-v2.herokuapp.com/weatherData/" + params)
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
                    <thead class="dataTableHeader">
                        <tr class="dataTableHeaderRow">
                            <th class="dataTableHeaderCell">_id</th>
                            <th class="dataTableHeaderCell">author</th>
                            <th class="dataTableHeaderCell">system_num</th>
                            <th class="dataTableHeaderCell">slrFD_W</th>
                            <th class="dataTableHeaderCell">rain_mm</th>
                            <th class="dataTableHeaderCell">strikes</th>
                            <th class="dataTableHeaderCell">dist_km</th>
                            <th class="dataTableHeaderCell">ws_ms</th>
                            <th class="dataTableHeaderCell">windDir</th>
                            <th class="dataTableHeaderCell">maxWS_ms</th>
                            <th class="dataTableHeaderCell">airT_C</th>
                            <th class="dataTableHeaderCell">vp_mmHg</th>
                            <th class="dataTableHeaderCell">bp_mmHg</th>
                            <th class="dataTableHeaderCell">rh</th>
                            <th class="dataTableHeaderCell">rht_c</th>
                            <th class="dataTableHeaderCell">tiltNS_deg</th>
                            <th class="dataTableHeaderCell">tiltWE_deg</th>
                            <th class="dataTableHeaderCell">date</th>
                            <th class="dataTableHeaderCell">date_mins_only</th>
                        </tr>
                    </thead>
                    <tbody class="dataTableBody">
                        {this.renderTable(this.state.apiResponse.data)}
                    </tbody>
                </table>
            </div>
        );
    }

    renderTable(data) {
        return data.map((dataPoint, index) => {
            return(
                <tr key={dataPoint._id} class="dataTableRow">
                    <td class="dataTableCell">{dataPoint._id}</td>
                    <td class="dataTableCell">{dataPoint.author}</td>
                    <td class="dataTableCell">{dataPoint.system_num}</td>
                    <td class="dataTableCell">{dataPoint.slrFD_W}</td>
                    <td class="dataTableCell">{dataPoint.rain_mm}</td>
                    <td class="dataTableCell">{dataPoint.strikes}</td>
                    <td class="dataTableCell">{dataPoint.dist_km}</td>
                    <td class="dataTableCell">{dataPoint.ws_ms}</td>
                    <td class="dataTableCell">{dataPoint.windDir}</td>
                    <td class="dataTableCell">{dataPoint.maxWS_ms}</td>
                    <td class="dataTableCell">{dataPoint.airT_C}</td>
                    <td class="dataTableCell">{dataPoint.vp_mmHg}</td>
                    <td class="dataTableCell">{dataPoint.bp_mmHg}</td>
                    <td class="dataTableCell">{dataPoint.rh}</td>
                    <td class="dataTableCell">{dataPoint.rht_c}</td>
                    <td class="dataTableCell">{dataPoint.tiltNS_deg}</td>
                    <td class="dataTableCell">{dataPoint.tiltWE_deg}</td>
                    <td class="dataTableCell">{dataPoint.date}</td>
                    <td class="dataTableCell">{dataPoint.date_mins_only}</td>
                </tr>
            );
        })
    }
}

export default RetrieveWeatherData;
