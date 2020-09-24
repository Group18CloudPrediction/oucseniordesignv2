import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Marker from './Marker';
import { useHistory } from "react-router-dom";

function Map(props) {
  const history = useHistory();

  const handleClick = (key) => {
    console.log(key);
    let path = "/";
    if(key === 'sub-28') {
      path = "/Sub/28";
      history.push(path);
    }
    else if(key === 'sub-27') {
      path = "/Sub/27";
      history.push(path);
    }
    else if(key === 'sub-29') {
      path = "/Sub/29";
     history.push(path);
    }
    else if(key === 'sub-33') {
      path = "/Sub/33";
      history.push(path);
    }
  }

  return (
    <div id="Map" style= {{ height: '92.5vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCn55lIh6mJ4GnR00jjgGeWUEii5R183xA" }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        options={props.options}
      >
      <Marker
          key={"sub-28"}
          text={"txt"}
          lat={28.29172}
          lng={-81.19373}
          onClick={() => handleClick("sub-28")}
        />
      <Marker
          key={"sub-27"}
          text={"txt"}
          lat={28.24917}
          lng={-81.28942}
          onClick={() => handleClick("sub-27")}
        />
      <Marker
          key={"sub-29"}
          text={"txt"}
          lat={28.22465}
          lng={-81.17819}
          onClick={() => handleClick("sub-29")}
        />
      <Marker
          key={"sub-33"}
          text={"txt"}
          lat={28.18127}
          lng={-81.27366}
          onClick={() => handleClick("sub-33")}
        />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
