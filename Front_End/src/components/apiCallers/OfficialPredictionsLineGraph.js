import React, {Component, useState, useEffect, useRef } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';



//import "../../stylesheets/Tooltips.css";

class OfficialPredictionsLineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            isLoading:true,
            hasError: false,
            error: null,
            
            width:  this.props.width  || 600,
            height: this.props.height || 200,

            numRefreshes: 0,
            measuredValues: [],

            lookbackDepth: this.props.lookbackDepth || 1,
            
            stationID: this.props.stationID,
//             year: this.props.year,
//             month: this.props.month,
//             day: this.props.day,
//             hour: this.props.hour,
//             minute: this.props.minute,
            dateTime: this.buildInitialDateTime(),
            startDateTime: this.buildInitialDateTime(),

            // base color: #8884d8
            predictionsColor:     this.props.predictionsColor     || "#dcd9fa",
            predictionsFillColor: this.props.predictionsFillColor || this.props.predictionsColor || "#9490f0",
            realDataColor:        this.props.realDataColor        || "#58ff4f",
            realDataFillColor:    this.props.realDataFillColor    || this.props.realDataColor    || "#58ff4f",

            averageExpectedDeviationColor:      this.props.averageExpectedDeviationColor     || "#5f5c96",
            averageExpectedDeviationFillColor:  this.props.averageExpectedDeviationFillColor || this.props.averageExpectedDeviationColor || "#5f5c96",
            worstExpectedDeviationColor:        this.props.worstExpectedDeviationColor       || "#2f2d4a",
            worstExpectedDeviationFillColor:    this.props.worstExpectedDeviationFillColor   || this.props.worstExpectedDeviationColor   || "#2f2d4a",  

            xAxisColor: this.props.xAxisColor || this.props.textColor || "#dddddd",
            yAxisColor: this.props.yAxisColor || this.props.textColor || "#dddddd",
            gridLinesColor: this.props.gridLinesColor || this.props.textColor || "#dddddd",

            tooltipBackgroundColor: this.props.tooltipBackgroundColor || '#131b23',//'#2c3e50',
            tooltipBorderColor: this.props.tooltipBorderColor || '#8884d8'
        };

        if (!this.props.stationID)
            this.setState({error: {message: "No stationID provided. Unable to display predictions."}});


        this.refreshData = () => {
            var date = new Date(this.state.dateTime.getTime()+60000);
            console.log("Refreshing! - old date: " + this.state.dateTime + " new date: " + date);
            this.setState({dateTime: date, numRefreshes:(this.state.numRefreshes+1)});
            this.callAPI();
        }
    }

    buildInitialDateTime() {
        if (
            !this.props.year  ||
            !this.props.month ||
            !this.props.day   ||
            !this.props.hour  ||
            !this.props.minute
        ) {
            return new Date();
        } else {
            return new Date(this.props.year, this.props.month, this.props.day, this.props.hour, this.props.minute);
        }
    }

    callAPI() {
        const server = require("./_apiRootAddress");
        const requestRootURI = "/powerPredictions/station/";
        const params = this.state.stationID;
        
        var postReqParams = {
            lookbackDepth: this.state.lookbackDepth
        }
        
        console.log(JSON.stringify(postReqParams));
        
        fetch(server + requestRootURI + params, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(postReqParams)
            })
            .then(response => response.json())
            .then(res => {
                console.log("official line graph");
                console.log(res);
                this.setState({apiResponse: res, predictions: res.data.latest_power_predictions, isLoading: false});
                this.state.measuredValues.push(res.data.latest_actualPowerValue);
            })
            .catch(err => this.setState({hasError:true, error:err}));
    }

    componentDidMount() {
        if(this.props.realTimeUpdates)
        {
            console.log("setting interval - OfficialPowerPredictionsLineGraph");
            this.interval = setInterval(this.refreshData, 60*1000);
        }
        
        
        
        console.log(this.state.height)
        
        this.callAPI();
    }
    
    componentWillUnmount() {
        // prevent memory leak
        if(this.props.realTimeUpdates)
            clearInterval(this.interval);
    }

    render() {
        if (this.state.hasError) {
            return <div>Error: <p>{this.state.error.message}</p></div>;
        }

        if (this.state.isLoading) {
            return <p>Loading Prediction Data...</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p>No data for the given station and timestamp: {this.props.stationID} @ {this.props.year +"-"+this.props.month+"-"+this.props.day+" T "+this.props.hour+":"+this.props.minute}</p>;
        }


        const displayData = this.createDisplayData();

        return this.renderGraph(displayData);
    }
    
    createDisplayData() {
        
        //
        // copy/pasted code from Upcoming15MinutesLineGraph, because I don't understand class inheritance in js
        //
        
        
        var displayData = [];

        const startHour = this.state.dateTime.getHours();
        const startMinute = this.state.dateTime.getMinutes();

        for (var i = 0; i < this.state.numRefreshes; i++)
        {
            var thisMinute = startMinute + i + 1;
            var thisHour = (thisMinute >= 60? startHour+1 : startHour) % 24;
            thisMinute = thisMinute % 60;

            const thisName = thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute;
            displayData.push({time: thisName, "measured": this.state.measuredValues[i], "predicted": this.state.measuredValues[i]});
        }

        console.log(this.state.measuredValues);

        //const data = this.state.apiResponse.data[0];
        const predictions = this.state.predictions;
        
        const hour = this.state.dateTime.getHours();
        const minute = this.state.dateTime.getMinutes();


        for (var i = 0; i < predictions.length; i++)
        {
            var thisMinute = minute + i + 1;
            var thisHour = (thisMinute >= 60? hour+1 : hour) % 24;
            thisMinute = thisMinute % 60;

            const thisName = thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute;
            const thisPredicted = this.props.clampAboveZero? Math.max(0, predictions[i]) : predictions[i];
            displayData.push({time: thisName, "predicted":thisPredicted});
        }
        
        //
        // end copy/pasted code
        //
        
        
        const calcExpected = (value, percError) => {
            const val = value + value*percError/100.0;
            return this.props.clampAboveZero? Math.max(0, val) : val;
        }
        
        const calcExpectedRange = (value, percError) => {
            if (value < 0) value *= -1;
            
            return [calcExpected(value, -percError), calcExpected(value, percError)];
        }
        
        
        // for the last 15 elements of displayData, calculate expected max and expected min, and add them as emin and emax
        // for all other elements, add emin and emax = uv
        
        var predictionsStart = displayData.length-15;
        
        for (var i = 0; i < predictionsStart; i++) {
            displayData[i].expectedDeviationAverageCase = [displayData[i].measured, displayData[i].measured];
            displayData[i].expectedDeviationWorstCase   = [displayData[i].measured, displayData[i].measured];
            
            //displayData[i].eMinAverage = displayData[i].measured;
            //displayData[i].eMaxAverage = displayData[i].measured;
            
            //displayData[i].eMinWorst = displayData[i].measured;
            //displayData[i].eMaxWorst = displayData[i].measured;
        }
        
        for (var i = predictionsStart; i < displayData.length; i++) {
            const minutesOut = i - predictionsStart;
            const prediction = this.state.apiResponse.data.latest_power_predictions[minutesOut];
            const averagPerc = this.state.apiResponse.data.historical_averagePercentErrors[minutesOut];
            const worstPerc  = this.state.apiResponse.data.historical_worstPercentErrors[minutesOut];
            
            const avgExpA = calcExpected(prediction, -averagPerc);
            const avgExpB = calcExpected(prediction, averagPerc);
            const wstExpA = calcExpected(prediction, -worstPerc);
            const wstExpB = calcExpected(prediction, worstPerc);
            
            displayData[i].expectedDeviationAverageCase = [Math.min(avgExpA, avgExpB), Math.max(avgExpA, avgExpB)];
            displayData[i].expectedDeviationWorstCase   = [Math.min(wstExpA, wstExpB), Math.max(wstExpA, wstExpB)];
            
            
//             displayData[i].eMinAverage = calcExpected(prediction, -averagPerc);
//             displayData[i].eMaxAverage = calcExpected(prediction, averagPerc);
//             
//             displayData[i].eMinWorst = calcExpected(prediction, -worstPerc);
//             displayData[i].eMaxWorst = calcExpected(prediction, worstPerc);
        }
        
        
        return displayData;
    }
    
    renderGraph(displayData) {
        const round = (number, decimalPlaces) => {
            if (isNaN(number)) {
                return number;
            }
            
            const factorOfTen = Math.pow(10, decimalPlaces)
            var retval = (Math.round(number * factorOfTen) / factorOfTen)
            
            return retval+"";
        }
        
        const formatLegendData = (value) => {
            console.log(value);
            if (value[0] != null)
                return round(value[0], 2) + " - " + round(value[1], 2) + " kW AC";
            else
                return round(value, 2) + " kW AC"
        }
        
        // CustomToolTip code modified from ericraq's code at
        // https://github.com/recharts/recharts/issues/1612#issuecomment-461898105
        const CustomToolTip = props => {
            const { active, payload, label } = props;
            if (!active || !payload) {
                return null;
            }
            
            const tooltip = {
                backgroundColor: this.state.tooltipBackgroundColor,//'#2c3e50',
                opacity: '0.9',
                border: '1px solid ' + this.state.tooltipBorderColor,
                borderRadius: '15px',
                paddingLeft:'10px',
                paddingRight:'10px'
            }
            
            return (
                <div> 
                    <div className="custom-tooltip" style={tooltip}>
                        <p style={{textAlign: 'center'}}>
                            <strong style={{color: this.state.predictionsColor}}>{label}</strong>
                        </p>
                        
                        <table> <tbody>
                            {payload.map((item, i, payload) => {
                                
                                //const itemColor = i == 1 ? (item.value > payload[0].value ? '#00A86B' :  '#FF2400') : item.color
                                const itemColor = item.color;
                                
                                return(
                                    <tr key={i}>
                                        <td style={{color: itemColor}} key={i}>
                                            {item.name}:  
                                        </td>
                                        <td style={{color: itemColor}} key={i}>
                                            {formatLegendData(item.value)}
                                        </td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody> </table>
                    </div>
                </div>
            )
        }
        
        console.log(this.state.width + " x " + this.state.height);
        //units : kW AC
        return (
            <div className="PowerPredictionsLineGraph" id="PowerPredictionsLineGraph">
                <AreaChart width={this.state.width} height={this.state.height} data={displayData}>
                    
                    <defs>
                        {
                            this.GetLineGraphColors()
                        }
                    </defs>
                    
                    {this.GetLines()}
                    
                    <CartesianGrid stroke={this.state.gridLinesColor} strokeDasharray="5 5" />
                    <XAxis dataKey="time" stroke={this.state.xAxisColor}/>
                    <YAxis dataKey="predicted" stroke={this.state.yAxisColor}/>
                    {/*<Tooltip className="powerPredictionTooltip" formatter={formatLegendData}  wrapperStyle={{ backgroundColor: '#000000' }}/>*/}
                    <Tooltip content={CustomToolTip}/>
                </AreaChart>
            </div>
        );
    }
    
    GetLineGraphColors() {
        var colors = [];
        
        colors.push(
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={this.state.predictionsFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.predictionsFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={this.state.realDataFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.realDataFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorEAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={this.state.averageExpectedDeviationFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.averageExpectedDeviationFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorEWorst" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={this.state.worstExpectedDeviationFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.worstExpectedDeviationFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        return colors;
    }
    
    GetLines() {
        var lines = [];
        
        
//         lines.push(<Area type="monotone" dataKey="eMinWorst" stroke={this.state.worstExpectedDeviationColor} fillOpacity={1} fill="url(#colorEWorst)"/>)
//         lines.push(<Area type="monotone" dataKey="eMaxWorst" stroke={this.state.worstExpectedDeviationColor} fillOpacity={1} fill="url(#colorEWorst)"/>)
//         
//         lines.push(<Area type="monotone" dataKey="eMinAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill="url(#colorEAvg)"/>)
//         lines.push(<Area type="monotone" dataKey="eMaxAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill="url(#colorEAvg)"/>)
//         
//         
//         lines.push(<Area type="monotone" dataKey="predicted" stroke={this.state.predictionsColor} fillOpacity={1} fill="url(#colorUv)" />)
//         lines.push(<Area type="monotone" dataKey="measured"  stroke={this.state.realDataColor}    fillOpacity={1} fill="url(#colorPv)" />)
//         
        
        
        //lines.push(<Area type="monotone" dataKey="eMinWorst" stroke={this.state.worstExpectedDeviationColor} fillOpacity={1} fill={this.state.worstExpectedDeviationFillColor}/>)
        //lines.push(<Area type="monotone" dataKey="eMaxWorst" stroke={this.state.worstExpectedDeviationColor} fillOpacity={1} fill={this.state.worstExpectedDeviationFillColor}/>)
        lines.push(<Area type="monotone" dataKey="expectedDeviationWorstCase" stroke={this.state.worstExpectedDeviationColor} strokeWidth={7} fillOpacity={1} fill={this.state.worstExpectedDeviationFillColor}/>)
        
        //lines.push(<Area type="monotone" dataKey="eMinAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        //lines.push(<Area type="monotone" dataKey="eMaxAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        lines.push(<Area type="monotone" dataKey="expectedDeviationAverageCase" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        
        lines.push(<Area type="monotone" dataKey="predicted" stroke={this.state.predictionsColor} fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)
        lines.push(<Area type="monotone" dataKey="measured"  stroke={this.state.realDataColor}    fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)
        
        
        return lines;
    
//          <Line type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                
    }
}

export default OfficialPredictionsLineGraph;
