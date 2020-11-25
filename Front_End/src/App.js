import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Error from "./components/Error";
import Navigation from "./components/Navigation";
import Archive from "./components/Archive";

import SubstationHomepageWrapper from "./components/SubstationHomepageWrapper";

import "./stylesheets/bootstrap.css";

class App extends Component {
  
  // Here's where we set up components that will be on every page, (just Navigation in our case)
  // the URLs our front end will handle,                           (listed below)
  // and the main component for each of those URLs.                (can be seen in the code)
  
  // URLs our front end handles:
  //    http://localhost:3000/ will route to our homepage,
  //    http://localhost:3000/archive will route to our archive page,
  //    various urls will route to substation homepage, for example, http://localhost:3000/Sub/27
  //         note: the ":stationID" works as a sort of variable. Whatever is put in that slot
  //               of the url (27 in the above example) will be passed to SubstationHomepageWrapper
  //               as a variable named stationID
  //    all other urls will route to the error page.
  
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
