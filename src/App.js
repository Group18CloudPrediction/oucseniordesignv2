import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './components/javascripts/Home';
import About from './components/javascripts/About';
import Contact from './components/javascripts/Contact';
import Error from './components/javascripts/Error';
import Navigation from './components/javascripts/Navigation';

import './components/stylesheets/App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
            <Switch>
              <Route path = "/" component={Home} exact/>
              <Route path = "/about" component={About}/>
              <Route path = "/contact" component={Contact}/>
              <Route component={Error}/>
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
