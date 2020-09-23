import React, { Component } from "react";
import Map from "./Home_Map.js";

const _center = {lat:28.2389, lng: -81.2312};
const _zoom = 13;
const _options = {
  streetViewControl: true,
  mapTypeControl: true,
};

class Home extends Component {

  render() {
    return(
      <div id="Home">
        <Map center = {_center}
             zoom = {_zoom}
             options = {_options}/>
      </div>
    );
  }
}

export default Home;
