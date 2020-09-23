import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";
import Sub_27 from "./components/Sub_27";
import Sub_28 from "./components/Sub_28";
import Sub_29 from "./components/Sub_29";
import Sub_33 from "./components/Sub_33";

import PowerPredictionsDashboard from "./components/PowerPredictionsDashboard";
import SubstationHomepageWrapper from "./components/SubstationHomepageWrapper";

import "./stylesheets/bootstrap.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div id="App">
          <Navigation />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/archive" component={Archive} />
            <Route path="/PowerPredictionsDashboard" component={PowerPredictionsDashboard} />
            
            <Route path="/Sub_27" component={Sub_27} />
            <Route path="/Sub_28" component={Sub_28} />
            <Route path="/Sub_29" component={Sub_29} />
            <Route path="/Sub_33" component={Sub_33} />
            
            <Route path="/Sub/:stationID" component={SubstationHomepageWrapper} />
            
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
