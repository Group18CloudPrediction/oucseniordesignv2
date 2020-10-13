import React, { Component } from "react";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";

const videoOptions = {
  poster: icon,
};

const overlayOptions = {};

class SubstationLivestream extends Component {
  render() {
    if (!this.props.stationID) return (<div id="Livestream">JSX / HTML Error: no stationID specified</div>);

    const url = "ws://cloudtracking-v2.herokuapp.com/sub-"+this.props.stationID

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
