import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 28.6024,
      lng: -81.2
    },
    zoom: 15
  }

  render () {
    return (
      //Always explicitly set container height.
      <div id="Map" style= {{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
