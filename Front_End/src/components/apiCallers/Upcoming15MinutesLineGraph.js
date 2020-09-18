import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class Upcoming15MinutesLineGraph extends Component {
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

        //const baseURI = "http://localhost:3000/powerPredictions/getNow/";
        const baseURI = "https://cloudtracking-v2.herokuapp.com/powerPredictions/getNow/";
        // this component REQUIRES the below props
        const params =
                 this.props.stationID + "/"
               + this.props.year + "/"
               + this.props.month + "/"
               + this.props.day + "/"
               + this.props.hour + "/"
               + this.props.minute;

        console.log(baseURI + params);

        fetch(baseURI + params)
            .then(response => response.json())
            .then(res => this.setState({apiResponse: res, isLoading: false}))
            .catch(err => this.setState({hasError:true, error:err}));

    }

    componentDidMount() {
        this.callAPI();
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

        console.log(this.state.apiResponse);
        console.log(this.state.apiResponse.data[0]);

        const data = this.state.apiResponse.data[0];

        const hour = this.props.hour;
        const minute = this.props.minute;
        const displayData = [];
//         const displayData = [
//             {name: hour+":"+(minute+1), "uv": data.powerPredictionsMade[0], amt: 2400},
//             {name: hour+":"+(minute+2), "uv": data.powerPredictionsMade[1], amt: 2210},
//             {name: hour+":"+(minute+3), "uv": data.powerPredictionsMade[2], amt: 2290},
//             {name: '1:03', "uv": 2780, amt: 2000},
//             {name: '1:04', "uv": 1890, amt: 2181},
//         ];

        for (var i = 0; i < data.powerPredictionsMade.length; i++)
        {
            var thisMinute = minute + i + 1;
            var thisHour = thisMinute >= 60? hour+1 : hour;
            thisMinute = thisMinute % 60;

            const thisName = thisHour + ":" + (thisMinute < 10? "0" : "") + thisMinute;
            displayData.push({time: thisName, uv:data.powerPredictionsMade[i]});
        }

        return (
            <LineChart width={400} height={400} data={displayData}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
            </LineChart>
        );

        return (
            <div id="RetrievedPredictions">

            </div>
        );
    }
}

export default Upcoming15MinutesLineGraph;
