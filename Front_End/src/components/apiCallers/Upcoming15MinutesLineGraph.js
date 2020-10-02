import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

// props
// realTimeUpdates -> if true, causes graph to add one minute to its current date/time and refresh, every minute
// year, month, day, hour, minute -> if these are all set, uses them to construct its initial date/time rather than the current system time
// stationID -> MANDATORY, selects which station to grab predictions for

class Upcoming15MinutesLineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            isLoading:true,
            hasError: false,
            error: null,
            
            numRefreshes: 0,
            measuredValues: [],
            
            stationID: this.props.stationID,
//             year: this.props.year,
//             month: this.props.month,
//             day: this.props.day,
//             hour: this.props.hour,
//             minute: this.props.minute,
            dateTime: this.buildInitialDateTime(),
            startDateTime: this.buildInitialDateTime()
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
        
        /*
        I'd like to try this.
          const server = process.env.server || "http://localhost:3000"

        with process.env.server = https://cloudtracking-v2.herokuapp.com
        this would make code a little more modular so we wont have to change code lines to access database.
        process.env.server would be defined on the heroku server. We could also try to use dotenv library which would accomplish the same thing.
        */
        const server = require("./_apiRootAddress");

        const baseURI = server+"/powerPredictions/getNow/";

        var hourOffset = 0;
        if (this.props.isEST && this.props.useUTC)
            hourOffset = 4;
        
        const params = 
                 this.state.stationID + "/" 
               + this.state.dateTime.getFullYear() + "/" 
               + this.state.dateTime.getMonth() + "/" 
               + this.state.dateTime.getDate() + "/" 
               + (this.state.dateTime.getHours()+hourOffset) + "/" 
               + this.state.dateTime.getMinutes();

        fetch(baseURI + params)
            .then(response => response.json())
            .then(res => {
                this.setState({apiResponse: res, isLoading: false});
                this.state.measuredValues.push(res.data[0].measuredPowerValue);
            })
            .catch(err => this.setState({hasError:true, error:err}));
    }
    
    
    
    componentDidMount() {
        if(this.props.realTimeUpdates)
        {
            console.log("setting interval");
            this.interval = setInterval(this.refreshData, 60*1000);
        }
        this.callAPI();
    }
    componentWillUnmount() {
        // prevent memory leak
        if(this.props.realTimeUpdates)
            clearInterval(this.interval);
    }
    
    render() {
        if (this.state.hasError) {
            return <p>Error: <p>{this.state.error.message}</p></p>;
        }

        if (this.state.isLoading) {
            return <p>Loading Prediction Data...</p>;
        }

        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }

        if (!this.state.apiResponse.data[0]) {
            return <p>No data for the given station and timestamp: {this.props.stationID} @ {this.props.year +"-"+this.props.month+"-"+this.props.day+" T "+this.props.hour+":"+this.props.minute}</p>;
        }


        const displayData = [];
        
        const startHour = this.state.dateTime.getHours();
        const startMinute = this.state.dateTime.getMinutes();
        
        for (var i = 0; i < this.state.numRefreshes; i++)
        {
            var thisMinute = startMinute + i + 1;
            var thisHour = (thisMinute >= 60? startHour+1 : startHour) % 24;
            thisMinute = thisMinute % 60;

            const thisName = thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute;
            displayData.push({time: thisName, "pv": this.state.measuredValues[i], "uv": this.state.measuredValues[i]});
        }
        
        console.log(this.state.measuredValues);
        
        const data = this.state.apiResponse.data[0];

        const hour = this.state.dateTime.getHours();
        const minute = this.state.dateTime.getMinutes();
        
        
        for (var i = 0; i < data.powerPredictionsMade.length; i++)
        {
            var thisMinute = minute + i + 1;
            var thisHour = (thisMinute >= 60? hour+1 : hour) % 24;
            thisMinute = thisMinute % 60;

            const thisName = thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute;
            displayData.push({time: thisName, "uv":data.powerPredictionsMade[i]});
        }

        return (
            <AreaChart width={400} height={400} data={displayData}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    {
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dbd24f" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#dbd24f" stopOpacity={0}/>
                    </linearGradient>
                    }
                </defs>
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
                <Area type="monotone" dataKey="pv" stroke="#b5ad38" fillOpacity={1} fill="url(#colorPv)"/>
                {
//                 <Line type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                }
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis dataKey="uv"/>
                <Tooltip />
            </AreaChart>
        );
    }
}

export default Upcoming15MinutesLineGraph;
