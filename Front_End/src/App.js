import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";
<<<<<<< HEAD
import Livestream from "./components/Livestream";
import Livestream1 from "./components/Livestream1";
import PowerPredictionsDashboard from "./components/PowerPredictionsDashboard";
=======
import Sub_27 from "./components/Sub_27";
import Sub_28 from "./components/Sub_28";
import Sub_29 from "./components/Sub_29";
import Sub_33 from "./components/Sub_33";
>>>>>>> 88c512fc2aaa9abf81c329591249d2abc12742c9

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
<<<<<<< HEAD
            <Route path="/livestream" component={Livestream} />
            <Route path="/livestream1" component={Livestream1} />
            <Route path="/PowerPredictionsDashboard" component={PowerPredictionsDashboard} />
=======
            <Route path="/Sub_27" component={Sub_27} />
            <Route path="/Sub_28" component={Sub_28} />
            <Route path="/Sub_29" component={Sub_29} />
            <Route path="/Sub_33" component={Sub_33} />
>>>>>>> 88c512fc2aaa9abf81c329591249d2abc12742c9
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
