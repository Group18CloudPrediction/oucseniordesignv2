import React, { Component } from 'react';

/**
 * Note: I'm using recharts for this component
 * https://recharts.org/en-US/guide/installation
 * 
 * npm install recharts
 **/

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class PowerPrediction extends Component {
    constructor() {
        super();
        
        this.constants = {
            numTimestepsPerPrediction: 15
        };
        
        this.state = {
            predictions: []
        };
        
        for (var i = 0; i < this.constants.numTimestepsPerPrediction; i++)
            this.state.predictions.push([]);
    }
    
    // this function expects p to look like this, for example:
    // p = [5, 5, 6, 1, 2, 3, 4, 5, 5, 5, 6, 5, 5, 5, 5]
    //      ^ prediction for 1 minute from now
    //         ^ prediction for 2 minutes from now
    //            ^ ...
    addPredictions(p) {
        for (var i = 0; i < this.constants.numTimestepsPerPrediction; i++)
            this.state.predictions[i].push(p[i]);
    }
    
    getTime(i) {
        return 0;
    }
    
     
    render() {
        // multiple lines example
        const data3 = [
            {name: '1:00', "uv": 4000, pv: 2400, amt: 2400},
            {name: '1:01', "uv": 3000, pv: 1398, amt: 2210},
            {name: '1:02', "uv": 2000, pv: 9800, amt: 2290},
            {name: '1:03', "uv": 2780, pv: 3908, amt: 2000},
            {name: '1:04', "uv": 1890, amt: 2181},
        ];
        
        return (
            <div>
            <p>Line Chart:</p>
            <LineChart width={400} height={400} data={data3}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </LineChart>
            <p>Bar Chart:</p>
            </div>
        );
    }
}

export default PowerPrediction;
