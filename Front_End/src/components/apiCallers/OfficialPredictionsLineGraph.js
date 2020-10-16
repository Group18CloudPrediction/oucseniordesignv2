import React, {Component, useState, useEffect, useRef } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';

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
            
            //maxRealValueRecordings: this.props.maxRealValueRecordings || 2, //5,
            dateTime: this.buildInitialDateTime(),
            startDateTime: this.buildInitialDateTime(),

            // base color: #8884d8
            widthPercent: this.props.widthPercent || 0.6,
            heightPercent: this.props.heightPercent || 0.8,
            
            predictionsColor:     this.props.predictionsColor     || "#dcd9fa",
            predictionsFillColor: this.props.predictionsFillColor || this.props.predictionsColor || "#9490f0",
            realDataColor:        this.props.realDataColor        || "#58ff4f",
            realDataFillColor:    this.props.realDataFillColor    || this.props.realDataColor    || "#58ff4f",

            averageExpectedDeviationColor:      this.props.averageExpectedDeviationColor     || "#6d6aad",//"#5f5c96",
            averageExpectedDeviationFillColor:  this.props.averageExpectedDeviationFillColor || this.props.averageExpectedDeviationColor || "#6d6aad",//"#5f5c96",
            worstExpectedDeviationColor:        this.props.worstExpectedDeviationColor       || "#4e4b7d",//"#2f2d4a",
            worstExpectedDeviationFillColor:    this.props.worstExpectedDeviationFillColor   || this.props.worstExpectedDeviationColor   || "#4e4b7d",//"#2f2d4a",  

            textColor:  this.props.textColor  || '#dddddd',
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
        
        this.setSize = () => {
            const myWidth  = document.getElementsByClassName('LineGraphWrapper')[0].offsetWidth;
            const myHeight = document.getElementsByClassName('LineGraphWrapper')[0].offsetHeight; 
        
            this.setState({width: myWidth, height: myHeight});
        }
        
        window.addEventListener('resize', this.setSize);
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
            
//                 if (this.state.measuredValues.length > this.state.maxRealValueRecordings)
//                 {
//                     // if we've already collected the max number of real values, delete the oldest one and update the graph's start time
//                     this.state.measuredValues.shift()
//                     this.setState({startDateTime: new Date(this.state.startDateTime.getTime()+60000)});
//                 }
                
            })
            .catch(err => this.setState({hasError:true, error:err}));
    }

    componentDidMount() {
        if(this.props.realTimeUpdates)
        {
            console.log("setting interval - OfficialPowerPredictionsLineGraph");
            const updateEveryXSeconds = 60;
            this.interval = setInterval(this.refreshData, updateEveryXSeconds*1000);
        }
        
        this.setSize();
        
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

            const thisName = this.militaryToStandardTime(thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute);
            displayData.push({time: thisName, "measured": this.state.measuredValues[i], "predicted":(i == this.state.numRefreshes-1? this.state.measuredValues[i] : null)});
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

            const thisName = this.militaryToStandardTime(thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute);
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
            
            var val = (i == predictionsStart-1 ? [displayData[i].measured, displayData[i].measured] : null)
            
            displayData[i]["average deviation"] = val;//null;//[displayData[i].measured, displayData[i].measured];
            displayData[i]["worst deviation"]   = val;//null;//[displayData[i].measured, displayData[i].measured];
            
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
            
            displayData[i]["average deviation"] = [Math.min(avgExpA, avgExpB), Math.max(avgExpA, avgExpB)];
            displayData[i]["worst deviation"]   = [Math.min(wstExpA, wstExpB), Math.max(wstExpA, wstExpB)];
            
            
//             displayData[i].eMinAverage = calcExpected(prediction, -averagPerc);
//             displayData[i].eMaxAverage = calcExpected(prediction, averagPerc);
//             
//             displayData[i].eMinWorst = calcExpected(prediction, -worstPerc);
//             displayData[i].eMaxWorst = calcExpected(prediction, worstPerc);
        }
        
        
        return displayData;
    }
    
    militaryToStandardTime(s) {
        var arr = s.split(":");
        var hour = parseInt(arr[0], 10);
        if (isNaN(hour))
            return s;
        if (hour > 12)
            return (hour-12) + ":" + arr[1] + " PM";
        else if (hour == 12)
            return 12 + ":" + arr[1] + " PM";
        else if (hour == 0)
            return 12 + ":" + arr[1] + " AM";
        else
            return s+" AM";
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
            if (value[0] != null)
                return round(value[0], 2) + " - " + round(value[1], 2) + " kW";
            else
                return round(value, 2) + " kW"
        }

        const myWidth = document.getElementsByClassName('LineGraphWrapper')[0].offsetWidth;
        const myHeight = document.getElementsByClassName('LineGraphWrapper')[0].offsetHeight;

        
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
                            <strong style={{color: this.state.textColor}}>{label}</strong>
                        </p>
                        
                        <table> <tbody>
                            {payload.map((item, i, payload) => {
                                
                                
                                //const itemColor = i == 1 ? (item.value > payload[0].value ? '#00A86B' :  '#FF2400') : item.color
//                                 const itemColor = item.color;
                                
                                
                                return(
                                    <tr key={i}>
                                        <th style={{color: item.color}} key={i+"tooltipDataName"}>
                                            {item.name}:  
                                        </th>
                                        <td key={i+"spacer"} style={{color: this.state.tooltipBackgroundColor}}>
                                          s
                                        </td>
                                        <td style={{color: item.color}} key={i+"tooltipDataValue"}>
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
        
        //units : kW AC
        return (
            <div className="PowerPredictionsLineGraph" id="PowerPredictionsLineGraph">
                <table style={{marginLeft:"auto", marginRight:"auto"}}> <tbody> <tr>
                    
                    <td style={{color:"#00000000"}}> aaa</td>
                    
                    <td>
                        <AreaChart width={this.state.width*this.state.widthPercent} height={this.state.height*this.state.heightPercent} data={displayData}>

                            <defs>
                                {
                                    this.GetLineGraphColors()
                                }
                            </defs>
                            
                            {this.GetLines()}
                            
                            <CartesianGrid stroke={this.state.gridLinesColor} strokeDasharray="5 5" />
                            <XAxis dataKey="time" stroke={this.state.xAxisColor}/>
                            <YAxis dataKey="predicted" stroke={this.state.yAxisColor}>
                                <Label
                                    value="Power Generation (kW AC)"
                                    position="insideLeft"
                                    angle={-90}
                                    style={{ textAnchor: 'middle', fill: this.state.textColor, fontWeight:"bold"}}
                                    />
                            </YAxis>
                            {/*<Tooltip className="powerPredictionTooltip" formatter={formatLegendData}  wrapperStyle={{ backgroundColor: '#000000' }}/>*/}
                            <Tooltip content={CustomToolTip}/>
                        </AreaChart>
                    </td>
                
                    <td style={{color:"#00000000"}}> a</td>
                
                    <td>
                        
                        {this.GetLegend(2)}
                        
                    </td>
                    
                </tr></tbody></table>
            </div>
        );
    }
    
    GetLegend(style) {
        if (style == -1)
            return null;
        if (style == 0)
            return (
                <table style={{color: this.state.textColor}}> <tbody>
                    <tr>
                        <td style={{ color: this.state.worstExpectedDeviationColor, backgroundColor: this.state.worstExpectedDeviationColor}}>sss</td>
                        <td> Expected Worst Deviation </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.averageExpectedDeviationColor, backgroundColor: this.state.averageExpectedDeviationColor}}>sss</td>
                        <td> Expected Average Deviation </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.predictionsColor, backgroundColor: this.state.predictionsColor}}>sss</td>
                        <td> Prediction </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.realDataColor, backgroundColor: this.state.realDataColor}}>sss</td>
                        <td> Actual Value </td>
                    </tr>
                </tbody> </table>
            );
        if (style == 1)
            return (
                <div>
                    <div> 
                        <span style={{color: this.state.worstExpectedDeviationColor}}>
                            ■
                        </span> 
                        <span style={{color:this.state.textColor}}>
                            - Expected Worst Deviation 
                        </span>
                    </div>
                    <div> 
                        <span style={{color: this.state.averageExpectedDeviationColor}}>
                            ■
                        </span> 
                        <span style={{color:this.state.textColor}}>
                            - Expected Average Deviation 
                        </span> 
                    </div>
                    <div> 
                        <span style={{color: this.state.predictionsColor}}>
                            ■
                        </span> 
                        <span style={{color:this.state.textColor}}>
                            - Prediction
                        </span> 
                    </div>
                    <div> 
                        <span style={{color: this.state.realDataColor}}>
                            ■
                        </span> 
                        <span style={{color:this.state.textColor}}>
                            - Actual Values
                        </span> 
                    </div>
                </div>
            );
        if (style == 2)
            return (
                <table style={{color: this.state.textColor}}> <tbody>
                    <tr>
                        <td style={{ color: this.state.worstExpectedDeviationColor, verticalAlign:"top"}}>██</td>
                        <td> Expected Worst Deviation </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.averageExpectedDeviationColor, verticalAlign:"top"}}>██</td>
                        <td> Expected Average Deviation </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.predictionsColor, verticalAlign:"top"}}>██</td>
                        <td> Prediction </td>
                    </tr>
                    <tr>
                        <td style={{ color: this.state.realDataColor, verticalAlign:"top"}}>██</td>
                        <td> Actual Value </td>
                    </tr>
                </tbody> </table>
            );
        return (<div>No Legend Specified</div>);
    }
    
    GetLineGraphColors() {
        var colors = [];
        
        colors.push(
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1" key="colorUv">
                <stop offset="5%" stopColor={this.state.predictionsFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.predictionsFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1" key="colorPv">
                <stop offset="5%" stopColor={this.state.realDataFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.realDataFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorEAvg" x1="0" y1="0" x2="0" y2="1" key="colorEAvg">
                <stop offset="5%" stopColor={this.state.averageExpectedDeviationFillColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={this.state.averageExpectedDeviationFillColor} stopOpacity={0}/>
            </linearGradient>
        );
        
        colors.push(
            <linearGradient id="colorEWorst" x1="0" y1="0" x2="0" y2="1" key="colorEWorst">
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
        lines.push(<Area type="monotone" dataKey="worst deviation" key="worst deviation" stroke={this.state.worstExpectedDeviationColor} strokeWidth={7} fillOpacity={1} fill={this.state.worstExpectedDeviationFillColor}/>)
        
        //lines.push(<Area type="monotone" dataKey="eMinAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        //lines.push(<Area type="monotone" dataKey="eMaxAverage" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        lines.push(<Area type="monotone" dataKey="average deviation" key="average deviation" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)
        
        lines.push(<Area type="monotone" dataKey="predicted" key="predicted" stroke={this.state.predictionsColor} fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)
        lines.push(<Area type="monotone" dataKey="measured"  key="measured"  stroke={this.state.realDataColor}    fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)
        
        
        return lines;
    
//          <Line type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                
    }
}

export default OfficialPredictionsLineGraph;
