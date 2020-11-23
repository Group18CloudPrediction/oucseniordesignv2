//
// This component is a counterpart to DisplayWeatherData. It is almost
// exactly the same, except it displays data differently.
//
// This component expects to be a child of RetrieveTargetedWeatherData
// and for that parent component to pass in its apiResponse variable
// This component will cause an error if its apiResponseData prop isn't
// properly set.
//
// Displays a single row of weather data in a human-readable way. Also
// displays cloud coverage percentage data as a bonus.
// 

import React, {Component} from "react";

import CloudCoveragePercentage from "../apiCallers/CloudCoveragePercentage.js";

class DisplayWeatherDataFriendly extends Component {
    render() {   
        // set up a function for formatting our numbers
        // rounds a given number to a given number of decimal places
        // and returns the result as a string.
        const round = (number, decimalPlaces) => {
            if (isNaN(number)) return "NaN";
            
            const factorOfTen = Math.pow(10, decimalPlaces)
            var retval = (Math.round(number * factorOfTen) / factorOfTen)
            
            return retval+"";
        }
        
        // this component will only ever display one entry / set of data at a time.
        var dataPoint = this.props.apiResponseData[0];
        
        // Renders only the desired data in a table, along with units and labels
        // also hosts the CloudCoveragePercentage component
        return ( 
            <div id="RetrievedWeatherData">
                <table className="friendlyDataTable" id="weatherDataTable_friendly">
                    <thead className="friendlyDataTableHeader">
                        
                    </thead>
                    
                    <tbody className="friendlyDataTableBody">
                        <tr className="friendlyDataTableRow">
                            <th className="friendlyDataTableCell friendlyDataTableLabel">Coverage Percentage:</th>
                            <td className="friendlyDataTableCell friendlyDataTableData"> <CloudCoveragePercentage stationID={this.props.stationID} postReq={true}/></td>
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
}

export default DisplayWeatherDataFriendly;
