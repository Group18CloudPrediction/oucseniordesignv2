import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './components/javascripts/Home';
import Error from './components/javascripts/Error';
import Navigation from './components/javascripts/Navigation';
import Archive from './components/javascripts/Archive';
import Livestream from './components/javascripts/Livestream';

import './components/stylesheets/bootstrap.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div id="App">
          <div id="nav">
            <Navigation />
          </div>
            <Switch>
              <Route path = "/" component={Home} exact/>
              <Route path = "/archive" component={Archive}/>
              <Route path = "/livestream" component={Livestream}/>
              <Route component={Error}/>
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
