import React, {Component} from "react";

import CloudCoveragePercentage from "../apiCallers/CloudCoveragePercentage.js";

class DisplayWeatherDataFriendly extends Component {
    render() {   
        const round = (number, decimalPlaces) => {
            if (isNaN(number)) return "NaN";
            
            const factorOfTen = Math.pow(10, decimalPlaces)
            var retval = (Math.round(number * factorOfTen) / factorOfTen)
            
            return retval+"";
        }
        
        var dataPoint = this.props.apiResponseData[0];
        
        return ( 
            <div id="RetrievedWeatherData">
                <table className="friendlyDataTable" id="weatherDataTable_friendly">
                    <thead className="friendlyDataTableHeader">
                        
                    </thead>
                    
                    <tbody className="friendlyDataTableBody">
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Coverage Percentage:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData"><CloudCoveragePercentage stationID={this.props.stationID}/></td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Solar Irradiance:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.slrFD_W, 3) + " watts/meter^2"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Temperature:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.airT_C, 3) + " °C"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Wind Direction:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.windDir, 3) + " °"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Wind Speed:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.ws_ms, 3) + " m/s"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Relative Humidity:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.rh, 3) + " %"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Barametric Pressure:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(dataPoint.bp_mmHg, 3) + " mmHg"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Dew Point:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData">{round(round(dataPoint.airT_C, 3) - (((100 - round(dataPoint.rh, 3))/5)), 3) + " °C"}</td>
                        </tr>
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Cloud Height:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData cloudheight">{round((1000 * (round(dataPoint.airT_C, 3) - (round(dataPoint.airT_C, 3) - (((100 - round(dataPoint.rh, 3))/5)))))/4.4, 3) + " meters"}</td>
                        </tr>
                        
                        
                    </tbody>
                </table>
            </div>
        );
    }
    
//     renderTable(data) {
//         
//         
//         return (
//                 <td className="friendlyDataTableCell">{dataPoint.slrFD_W}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.rain_mm}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.strikes}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.dist_km}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.ws_ms, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.windDir, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.maxWS_ms, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.airT_C, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.vp_mmHg, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.bp_mmHg, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.rh, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.rht_c, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.tiltNS_deg, 3)}</td>
//                 <td className="friendlyDataTableCell">{round(dataPoint.tiltWE_deg, 3)}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.date}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.date_mins_only}</td>
//                 <td className="friendlyDataTableCell">{dataPoint.time_only}</td>
//                 <td className="friendlyDataTableCell">{dataPoint._id}</td>
//             </tr>
//         )
//     }
}

export default DisplayWeatherDataFriendly;
