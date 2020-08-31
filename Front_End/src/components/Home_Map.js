import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Marker from './Marker';

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 28.2389,
      lng: -81.2312
    },
    zoom: 13,
    options: {
      streetViewControl: true,
      mapTypeControl: true,
    }
  }

  render () {
    return (
      //Always explicitly set container height.
      <div id="Map" style= {{ height: '92.5vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={this.props.options}
        >
        <Marker
            key={"top-right"}
            text={"txt"}
            lat={28.29}
            lng={-81.1912}
          />
        <Marker
            key={"top-left"}
            text={"txt"}
            lat={28.2489}
            lng={-81.2812}
          />
        <Marker
            key={"bot-right"}
            text={"txt"}
            lat={28.2189}
            lng={-81.1762}
          />
        <Marker
            key={"bot-left"}
            text={"txt"}
            lat={28.1919}
            lng={-81.2712}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
