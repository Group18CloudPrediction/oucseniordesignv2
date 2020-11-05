// Import
import React, { Component } from "react";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";
import { url } from "./apiCallers/_apiRootAddress";

// Set Video Options
const videoOptions = {
  poster: icon,
};

// Set Overlay Options
const overlayOptions = {};
//Get which address we are sending to
let server = url;

//edit server string to conform to livestream url needs => removes http(s)://
let pos = server.lastIndexOf("/");
server = server.slice(pos+1, server.length)

// Class
class SubstationLivestream extends Component {
  // Render the following html
  render() {
    // If there is no stationID passed, returned error message
    if (!this.props.stationID) return (<div id="Livestream">JSX / HTML Error: no stationID specified</div>);

    //const url = "ws://cloudtracking-v2.herokuapp.com/sub-"+this.props.stationID
    const url = "wss://" + server + "/sub-" + this.props.stationID
    return (
      <div id="Livestream" >
        <h1> Substation {this.props.stationID}</h1>
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl={url}
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
      </div>
    );
  }
}

export default SubstationLivestream;
