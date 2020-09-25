import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";

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
            <Route path="/Sub/:stationID" component={SubstationHomepageWrapper} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
