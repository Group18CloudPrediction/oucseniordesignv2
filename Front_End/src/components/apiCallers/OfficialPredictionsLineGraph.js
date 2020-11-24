//
// This component uses the Recharts library to plot a line graph of the solar panel
// output predictions made for a particular substation. It also displays some expected
// error / deviation information, and a history of actual power values.
//
// Aside from the actual power predictions, every component of this graph is toggleable
// by using the legend - the colored rectangles double as buttons!
//
// note: this component uses only the most recent entry in the predictions database
// this is because any other prediction will be outdated. For example, if it's currently
// 1:08pm, the current most recent entry's prediction for 1:09pm is only one minute out,
// which has a better predicted accuracy than the second most recent entry's prediction 
// for 1:09pm. The second most recent entry was made at 1:07pm, and so the 1:09pm prediction
// is a two-minute-out prediction.
//
// this component takes a ton of props that allow you to set the colors of the graph however you want
//
// we had to do something special to get the graph to change size when the page changes size
// recharts requires a set pixel width and height. See the end of the constructor if you 
// want to know how we did that.
//
// note: I made up the standards for API Caller stuff. API Caller is a term I use to refer to 
// components in the apiCallers folder of our project
//
// ====
// LIST OF PROPS
// ====
//
// -- NOTE: even though width and height get overriden, widthPercent and heightPercent do not.
// width    -- width of the line graph (in pixels)  -- NOTE: gets overriden when the graph automatically resizes itself
// height   -- height of the line graph (in pixels) -- NOTE: gets overriden when the graph automatically resizes itself
// widthPercent    -- really more of "widthScale", width is multiplied by this value before being passed in to the recharts component
// heightPercent   -- see above
//
// 
// lookbackDepth   -- how far back expected error calculations should consider
// realTimeUpdates -- should this graph automatically update every minute?
// clampAboveZero  -- should this graph display Max(data, 0) or just the straight data? if true, all data displayed will be >= 0
// maxRealValueRecordings -- how many real values to present (max), currently unimplemented I believe
//
// stationID -- what stationID to present predictions for
//
// -- the below 5 props are best not specified / used
// year      -- currently just sets the start date of the graph on the user end; doesn't affect what data is pulled from the db
// month     -- see above
// day       -- see above
// hour      -- see above
// minute    -- see above
//
//
// COLOR PROPS
//
// predictionsColor 
// predictionsFillColor
// realDataColor
// realDataFillColor
// averageExpectedDeviationColor
// averageExpectedDeviationFillColor
// worstExpectedDeviationColor
// worstExpectedDeviationFillColor
// textColor
// disabledColor
// xAxisColor
// yAxisColor
// gridLinesColor
// tooltipBackgroundColor
// tooltipBorderColor
// buttonColor
//

import React, {Component, useState, useEffect, useRef } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
import { url } from "./_apiRootAddress";

class OfficialPredictionsLineGraph extends Component {
    constructor(props) {
        super(props);
        
        // set some default values 
        // for almost every prop, I set up a state value and used that instead
        // that allows me to set default values in case the prop isn't defined
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

            // allow for toggling different parts of the graph visible/not visible
            toggle_realValues: true,
            toggle_worstDeviation: true,
            toggle_averageDeviation: true,


            //maxRealValueRecordings: this.props.maxRealValueRecordings || 2, //5,
            dateTime: this.buildInitialDateTime(),
            startDateTime: this.buildInitialDateTime(),

            widthPercent: this.props.widthPercent || 0.6,
            heightPercent: this.props.heightPercent || 0.8,

            // colors
            // base color: #8884d8
            predictionsColor:     this.props.predictionsColor     || "#dcd9fa",
            predictionsFillColor: this.props.predictionsFillColor || this.props.predictionsColor || "#9490f0",
            realDataColor:        this.props.realDataColor        || "#58ff4f",
            realDataFillColor:    this.props.realDataFillColor    || this.props.realDataColor    || "#58ff4f",

            averageExpectedDeviationColor:      this.props.averageExpectedDeviationColor     || "#6d6aad",//"#5f5c96",
            averageExpectedDeviationFillColor:  this.props.averageExpectedDeviationFillColor || this.props.averageExpectedDeviationColor || "#6d6aad",//"#5f5c96",
            worstExpectedDeviationColor:        this.props.worstExpectedDeviationColor       || "#4e4b7d",//"#2f2d4a",
            worstExpectedDeviationFillColor:    this.props.worstExpectedDeviationFillColor   || this.props.worstExpectedDeviationColor   || "#4e4b7d",//"#2f2d4a",

            textColor:      this.props.textColor      || '#dddddd',
            disabledColor:  this.props.disabledColor  || '#111111',
            disabledOpacity: 0.6,
            xAxisColor: this.props.xAxisColor || this.props.textColor || "#dddddd",
            yAxisColor: this.props.yAxisColor || this.props.textColor || "#dddddd",
            gridLinesColor: this.props.gridLinesColor || this.props.textColor || "#dddddd",

            tooltipBackgroundColor: this.props.tooltipBackgroundColor || '#131b23',//'#2c3e50',
            tooltipBorderColor: this.props.tooltipBorderColor || '#8884d8',

            buttonColor: this.props.buttonColor || '#2c3e50'

        };

        if (!this.props.stationID)
            this.setState({error: {message: "No stationID provided. Unable to display predictions."}});

        
        this.refreshData = () => {
            var date = new Date(this.state.dateTime.getTime()+60000);
            console.log("Refreshing! - old date: " + this.state.dateTime + " new date: " + date);
            this.setState({dateTime: date, numRefreshes:(this.state.numRefreshes+1)});
            this.callAPI();
        }

        
        // here's the really cool stuff
        // this is how we got the line graph to resize itself whenever the window / a parent component is resized
        this.setSize = () => {
            const myWidth  = document.getElementsByClassName('LineGraphWrapper')[0].offsetWidth;
            const myHeight = document.getElementsByClassName('LineGraphWrapper')[0].offsetHeight;

            this.setState({width: myWidth, height: myHeight});
        }

        window.addEventListener('resize', this.setSize);
    }

    // convenience function
    // until someone implements the "request data from a particular time" feature
    // this will basically only return new Date();
    buildInitialDateTime() {
        if (
            !this.props.year  ||
            !this.props.month ||
            !this.props.day   ||
            !this.props.hour  ||
            !this.props.minute
        ) {
            return new Date(); // creates a date object representing the current date and time
        } else {
            return new Date(this.props.year, this.props.month, this.props.day, this.props.hour, this.props.minute);
        }
    }

    // standard API Caller function, POST request flavor
    // note: I made up the standards for API Caller stuff. API Caller is a term I use to refer to 
    // components in the apiCallers folder of our project
    callAPI() {
        // I don't know what the difference between a URI and a URL is
        // I just kinda called them whatever I felt like at the time
        const server = url
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

                if (res.data) {
                    this.setState({apiResponse: res, predictions: res.data.latest_power_predictions, isLoading: false});
                    this.state.measuredValues.push(res.data.latest_actualPowerValue);
                } else {
                    this.setState({hasError: true, error : {message: res.message}})
                }
                
                // the below commented code didn't work. I'm leaving it here though in case you want to add this feature
                // it's not much but it will at least give you a place to start
//                 if (this.state.measuredValues.length > this.state.maxRealValueRecordings)
//                 {
//                     // if we've already collected the max number of real values, delete the oldest one and update the graph's start time
//                     this.state.measuredValues.shift()
//                     this.setState({startDateTime: new Date(this.state.startDateTime.getTime()+60000)});
//                 }

            })
            .catch(err => this.setState({hasError:true, error:err}));
    }

    // function is called by React when the page loads.
    // sets up the "refresh data every minute" feature
    // the initial call to the API
    // and the initial size of the graph
    componentDidMount() {
        if(this.props.realTimeUpdates)
        {
            console.log("setting interval - OfficialPowerPredictionsLineGraph");
            const updateEveryXSeconds = 60;
            this.interval = setInterval(this.refreshData, updateEveryXSeconds*1000);
        }

        this.setSize(); // set the size of the component on refresh

        this.callAPI();
    }

    componentWillUnmount() {
        // prevent memory leak
        if(this.props.realTimeUpdates)
            clearInterval(this.interval);
    }

    // standard API Caller render function
    render() {
        const messageStyle = {
            color: this.state.textColor,
            textAlign: "center"
        }

        if (this.state.hasError) {
            return <div style={messageStyle}>Error: <p>{this.state.error.message}</p></div>;
        }

        if (this.state.isLoading) {
            return <p style={messageStyle}>Loading Prediction Data...</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p style={messageStyle}>Recieved bad response</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p style={messageStyle}>No data for the given station and timestamp: {this.props.stationID} @ {this.props.year +"-"+this.props.month+"-"+this.props.day+" T "+this.props.hour+":"+this.props.minute}</p>;
        }


        const displayData = this.createDisplayData();

        return this.renderGraph(displayData);
    }

    
    createDisplayData() {

        //
        // copy/pasted code from Upcoming15MinutesLineGraph, because I don't understand class inheritance in js :(
        //


        var displayData = [];

        if (this.state.toggle_realValues)
        {
            const startHour = this.state.startDateTime.getHours();
            const startMinute = this.state.startDateTime.getMinutes();

            for (var i = 0; i < this.state.numRefreshes; i++)
            {
                var thisMinute = startMinute + i + 1;
                var thisHour = (thisMinute >= 60? startHour+1 : startHour) % 24;
                thisMinute = thisMinute % 60;

                const thisName = this.militaryToStandardTime(thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute);
                displayData.push({time: thisName, "measured": this.state.measuredValues[i], "predicted":(i == this.state.numRefreshes-1? this.state.measuredValues[i] : null)});
            }
        }

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

            if (this.state.toggle_averageDeviation) displayData[i]["average deviation"] = val;//null;//[displayData[i].measured, displayData[i].measured];
            if (this.state.toggle_worstDeviation)   displayData[i]["worst deviation"]   = val;//null;//[displayData[i].measured, displayData[i].measured];

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

            if (this.state.toggle_averageDeviation) displayData[i]["average deviation"] = [Math.min(avgExpA, avgExpB), Math.max(avgExpA, avgExpB)];
            if (this.state.toggle_worstDeviation)   displayData[i]["worst deviation"]   = [Math.min(wstExpA, wstExpB), Math.max(wstExpA, wstExpB)];


//             displayData[i].eMinAverage = calcExpected(prediction, -averagPerc);
//             displayData[i].eMaxAverage = calcExpected(prediction, averagPerc);
//
//             displayData[i].eMinWorst = calcExpected(prediction, -worstPerc);
//             displayData[i].eMaxWorst = calcExpected(prediction, worstPerc);
        }


        return displayData;
    }

    // military time is easier to work with in code, but not as nice to present
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

    
    
    // 
    // OUTLINE FOR THIS FUNCTION:
    //
    // 1. Define helper functions
    // 2. Set up custom tooltip
    // 3.
    //
    //
    // this function is huge. It's dangerous to read this alone, take this:
    //
    //   /\
    //  /  \
    //  |  | 
    //  |  | 
    //  |  | 
    //  |  |
    // =++++=
    //   ||
    //   ++
    //
    renderGraph(displayData) {
        // ========================================================
        // define some helper functions for formatting stuff
        // ========================================================
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

        //const myWidth = document.getElementsByClassName('LineGraphWrapper')[0].offsetWidth;
        //const myHeight = document.getElementsByClassName('LineGraphWrapper')[0].offsetHeight;

        // ========================================================
        // Create the custom tooltip
        // ========================================================

        // (the default tooltip is hard to read with the colors we chose, and doesn't match the site's style anyway)
        
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

    // builds the jsx that represents the legend
    // once upon a time, I had multiple legend styles to choose from,
    // but ultimately I decided this was the best
    GetLegend(style) {
        const worstExpToggle   = () => { this.setState({toggle_worstDeviation:   !this.state.toggle_worstDeviation});   }
        const averageExpToggle = () => { this.setState({toggle_averageDeviation: !this.state.toggle_averageDeviation}); }
        const realValToggle    = () => { this.setState({toggle_realValues:       !this.state.toggle_realValues});       }

        // the buttons are tied to state values, eg this.state.toggle_worstDeviation
        // when their respective data is disabled, the button goes partially transparent
        return (
            <table style={{color: this.state.textColor}}> <tbody>
                <tr>
                    <td style={{ color: this.state.worstExpectedDeviationColor, verticalAlign:"top"}}>
                        <button onClick={worstExpToggle} style={{opacity:(this.state.toggle_worstDeviation? 1 : this.state.disabledOpacity), borderColor:this.state.tooltipBorderColor, backgroundColor:this.state.worstExpectedDeviationColor,  color: this.state.worstExpectedDeviationColor}}>
                            ██
                        </button>
                    </td>
                    <td> Expected Worst Deviation </td>
                </tr>
                <tr>
                    <td style={{ color: this.state.averageExpectedDeviationColor, verticalAlign:"top"}}>
                        <button onClick={averageExpToggle} style={{opacity:(this.state.toggle_averageDeviation? 1 : this.state.disabledOpacity), borderColor:this.state.tooltipBorderColor, backgroundColor:this.state.averageExpectedDeviationColor, color: this.state.averageExpectedDeviationColor}}>
                            ██
                        </button>
                    </td>
                    <td> Expected Average Deviation </td>
                </tr>
                <tr>
                    <td style={{ color: this.state.predictionsColor, verticalAlign:"top"}}>
                        <button style={{ color: this.state.predictionsColor, borderColor:this.state.tooltipBorderColor, backgroundColor:this.state.predictionsColor}}>
                            ██
                        </button>
                    </td>
                    <td> Prediction </td>
                </tr>
                <tr>
                    <td style={{ color: this.state.realDataColor, verticalAlign:"top"}}>
                        <button onClick={realValToggle} style={{opacity:(this.state.toggle_realValues? 1 : this.state.disabledOpacity), borderColor:this.state.tooltipBorderColor, backgroundColor:this.state.realDataColor, color: this.state.realDataColor}}>
                            ██
                        </button>
                    </td>
                    <td> Estimated Actual Value </td>
                </tr>
            </tbody> </table>
        );
    }

    // set up the components the graph will refer to when drawing
    // these may be unused, but they provide an alternate style with a fade effect
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

        lines.push(<Area type="monotone" dataKey="worst deviation" key="worst deviation" stroke={this.state.worstExpectedDeviationColor} strokeWidth={7} fillOpacity={1} fill={this.state.worstExpectedDeviationFillColor}/>)
        lines.push(<Area type="monotone" dataKey="average deviation" key="average deviation" stroke={this.state.averageExpectedDeviationColor} fillOpacity={1} fill={this.state.averageExpectedDeviationFillColor}/>)

        lines.push(<Area type="monotone" dataKey="predicted" key="predicted" stroke={this.state.predictionsColor} fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)
        lines.push(<Area type="monotone" dataKey="measured"  key="measured"  stroke={this.state.realDataColor}    fillOpacity={0} strokeWidth={5} fill={this.state.predictionsFillColor} />)


        return lines;
    }
}

export default OfficialPredictionsLineGraph;
