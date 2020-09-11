import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";
import Sub_27_Livestream from "./components/Sub_27_Livestream";
import Sub_28_Livestream from "./components/Sub_28_Livestream";
import Sub_29_Livestream from "./components/Sub_29_Livestream";
import Sub_33_Livestream from "./components/Sub_33_Livestream";

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
            <Route path="/Sub_27_Livestream" component={Sub_27_Livestream} />
            <Route path="/Sub_28_Livestream" component={Sub_28_Livestream} />
            <Route path="/Sub_29_Livestream" component={Sub_29_Livestream} />
            <Route path="/Sub_33_Livestream" component={Sub_33_Livestream} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
