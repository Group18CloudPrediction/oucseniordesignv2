import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";
import Livestream from "./components/Livestream";
import Livestream1 from "./components/Livestream1";
import Livestream2 from "./components/Livestream2";
import Livestream3 from "./components/Livestream3";

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
            <Route path="/livestream" component={Livestream} />
            <Route path="/livestream1" component={Livestream1} />
            <Route path="/livestream2" component={Livestream2} />
            <Route path="/livestream3" component={Livestream3} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
