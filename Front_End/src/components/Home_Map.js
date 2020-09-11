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
            key={"sub-28"}
            text={"txt"}
            lat={28.29172}
            lng={-81.19373}
          />
        <Marker
            key={"sub-27"}
            text={"txt"}
            lat={28.24917}
            lng={-81.28942}
          />
        <Marker
            key={"sub-29"}
            text={"txt"}
            lat={28.22465}
            lng={-81.17819}
          />
        <Marker
            key={"sub-33"}
            text={"txt"}
            lat={28.18127}
            lng={-81.27366}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
