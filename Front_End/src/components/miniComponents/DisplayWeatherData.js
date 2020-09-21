import React, {Component} from "react";

import "../../stylesheets/dataTables.css";

class DisplayWeatherData extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {    
        return ( 
            <div id="RetrievedWeatherData">
                <table class="dataTable" id="weatherDataTable">
                    <thead class="dataTableHeader">
                        <tr class="dataTableHeaderRow">
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
                            <th class="dataTableHeaderCell">_id</th>
                        </tr>
                    </thead>
                    <tbody class="dataTableBody">
                        {this.renderTable(this.props.apiResponseData)}
                    </tbody>
                </table>
            </div>
        );
    }
    
    renderTable(data) {
        const round = (number, decimalPlaces) => {
            const factorOfTen = Math.pow(10, decimalPlaces)
            return (Math.round(number * factorOfTen) / factorOfTen)
        }
        
        return data.map((dataPoint, index) => {
            return(
                <tr key={dataPoint._id} class="dataTableRow">
                    <td class="dataTableCell">{dataPoint.author}</td>
                    <td class="dataTableCell">{dataPoint.system_num}</td>
                    <td class="dataTableCell">{dataPoint.slrFD_W}</td>
                    <td class="dataTableCell">{dataPoint.rain_mm}</td>
                    <td class="dataTableCell">{dataPoint.strikes}</td>
                    <td class="dataTableCell">{dataPoint.dist_km}</td>
                    <td class="dataTableCell">{round(dataPoint.ws_ms, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.windDir, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.maxWS_ms, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.airT_C, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.vp_mmHg, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.bp_mmHg, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.rh, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.rht_c, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.tiltNS_deg, 3)}</td>
                    <td class="dataTableCell">{round(dataPoint.tiltWE_deg, 3)}</td>
                    <td class="dataTableCell">{dataPoint.date}</td>
                    <td class="dataTableCell">{dataPoint.date_mins_only}</td>
                    <td class="dataTableCell">{dataPoint._id}</td>
                </tr>
            );
        })
    }
}

export default DisplayWeatherData;
