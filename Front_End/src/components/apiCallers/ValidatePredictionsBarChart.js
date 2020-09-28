

// prop for validate over the past N minutes
// gives one bar for the average % error of 1 minute out predictions over the past N minutes
// another bar for 2 minute out
// ...

import React, {Component} from "react";

// I had some great help making this component from these two links
// https://www.robinwieruch.de/react-fetching-data

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

class ValidatePredictionsBarChart extends Component {

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
        
        const params = (!this.props.stationID ? "" : this.props.stationID);
        const baseURL = require("./_apiRootAddress");
        
        var postReqParams = {
            stationID: this.props.stationID,
            overNMostRecent: this.props.overNMostRecent,
            
            year:   this.props.year,
            month:  this.props.month,
            day:    this.props.day,
            hour:   this.props.hour,
            minute: this.props.minute
        }
        
        console.log(postReqParams);
        
        var postReqURL = baseURL + "/powerPredictions/validate/" + params;
            
        fetch(postReqURL, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(postReqParams)
            })
            .then (response => response.json()                                     )
            .then (res      => this.setState({apiResponse: res, isLoading: false}) )
            .catch(err      => this.setState({hasError:true, error:err})           );
        
        this.setState({hasSubmitted: true});
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
        
        console.log(this.state.apiResponse)
        
        if (!this.state.apiResponse.data) {
            return <p>Recieved bad response</p>;
        }
        
        console.log(this.state.apiResponse.data.data)
        
        const barData = [
            {"name": "1 Minute Out", "uv": this.state.apiResponse.data.data[0]},
            {"name": "2 Minutes Out", "uv": this.state.apiResponse.data.data[1]},
            {"name": "3 Minutes Out", "uv": 5},//this.state.apiResponse.data.data[2]},
            {"name": "4 Minutes Out", "uv": this.state.apiResponse.data.data[3]},
            {"name": "5 Minutes Out", "uv": this.state.apiResponse.data.data[4]},
            {"name": "6 Minutes Out", "uv": this.state.apiResponse.data.data[5]},
            {"name": "7 Minutes Out", "uv": this.state.apiResponse.data.data[6]},
            {"name": "8 Minutes Out", "uv": this.state.apiResponse.data.data[7]},
            {"name": "9 Minutes Out", "uv": this.state.apiResponse.data.data[8]},
            {"name": "10 Minutes Out", "uv": this.state.apiResponse.data.data[9]},
            {"name": "11 Minutes Out", "uv": this.state.apiResponse.data.data[10]},
            {"name": "12 Minutes Out", "uv": this.state.apiResponse.data.data[11]},
            {"name": "13 Minutes Out", "uv": this.state.apiResponse.data.data[12]},
            {"name": "14 Minutes Out", "uv": this.state.apiResponse.data.data[13]},
            {"name": "15 Minutes Out", "uv": this.state.apiResponse.data.data[14]},
        ]
        
        console.log(barData)
        
        const data = [
            {
                name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
            },
            {
                name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
            },
            {
                name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
            },
            {
                name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
            },
            {
                name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
            },
            {
                name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
            },
            {
                name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
            },
        ];


        
        //return (<div>nyi</div>)
        return (
            <div>
                <BarChart
                    width={500}
                    height={300}
                    data={barData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/*<Bar dataKey="pv" fill="#8884d8" />*/}
                    <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
            </div>
        )
        
    }
}

export default ValidatePredictionsBarChart;



/*
 * import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';

  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    );
  }
}
*/
