//
// Recieves a mongoDB query's results, obtained by the RetrieveTargetedWeatherData
// component. 
//
// This component is a counterpart to DisplayWeatherDataFriendly. It is almost
// exactly the same, except it displays data differently.
//
// This component expects to be a child of RetrieveTargetedWeatherData
// and for that parent component to pass in its apiResponse variable
// This component will cause an error if its apiResponseData prop isn't
// properly set.
//

import React, {Component} from "react";

import "../../stylesheets/dataTables.css";

class DisplayWeatherData extends Component {
    render() {    
        return ( 
            <div id="RetrievedWeatherData">
                <table className="dataTable" id="weatherDataTable">
                    <thead className="dataTableHeader">
                        <tr className="dataTableHeaderRow">
                            <th className="dataTableHeaderCell">author</th>
                            <th className="dataTableHeaderCell">system_num</th>
                            <th className="dataTableHeaderCell">slrFD_W</th>
                            <th className="dataTableHeaderCell">rain_mm</th>
                            <th className="dataTableHeaderCell">strikes</th>
                            <th className="dataTableHeaderCell">dist_km</th>
                            <th className="dataTableHeaderCell">ws_ms</th>
                            <th className="dataTableHeaderCell">windDir</th>
                            <th className="dataTableHeaderCell">maxWS_ms</th>
                            <th className="dataTableHeaderCell">airT_C</th>
                            <th className="dataTableHeaderCell">vp_mmHg</th>
                            <th className="dataTableHeaderCell">bp_mmHg</th>
                            <th className="dataTableHeaderCell">rh</th>
                            <th className="dataTableHeaderCell">rht_c</th>
                            <th className="dataTableHeaderCell">tiltNS_deg</th>
                            <th className="dataTableHeaderCell">tiltWE_deg</th>
                            <th className="dataTableHeaderCell">date</th>
                            <th className="dataTableHeaderCell">date_mins_only</th>
                            <th className="dataTableHeaderCell">time_only</th>
                            <th className="dataTableHeaderCell">_id</th>
                        </tr>
                    </thead>
                    <tbody className="dataTableBody">
                        {this.renderTable(this.props.apiResponseData)}
                    </tbody>
                </table>
            </div>
        );
    }
    
    renderTable(data) {
        const round = (number, decimalPlaces) => {
            if (isNaN(number)) return "NaN";
            
            const factorOfTen = Math.pow(10, decimalPlaces)
            var retval = (Math.round(number * factorOfTen) / factorOfTen)
            
            return retval+"";
        }
        
        return data.map((dataPoint, index) => {
            return(
                <tr key={dataPoint._id} className="dataTableRow">
                    <td className="dataTableCell">{dataPoint.author}</td>
                    <td className="dataTableCell">{dataPoint.system_num}</td>
                    <td className="dataTableCell">{dataPoint.slrFD_W}</td>
                    <td className="dataTableCell">{dataPoint.rain_mm}</td>
                    <td className="dataTableCell">{dataPoint.strikes}</td>
                    <td className="dataTableCell">{dataPoint.dist_km}</td>
                    <td className="dataTableCell">{round(dataPoint.ws_ms, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.windDir, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.maxWS_ms, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.airT_C, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.vp_mmHg, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.bp_mmHg, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.rh, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.rht_c, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.tiltNS_deg, 3)}</td>
                    <td className="dataTableCell">{round(dataPoint.tiltWE_deg, 3)}</td>
                    <td className="dataTableCell">{dataPoint.date}</td>
                    <td className="dataTableCell">{dataPoint.date_mins_only}</td>
                    <td className="dataTableCell">{dataPoint.time_only}</td>
                    <td className="dataTableCell">{dataPoint._id}</td>
                </tr>
            );
        })
    }
}

export default DisplayWeatherData;
