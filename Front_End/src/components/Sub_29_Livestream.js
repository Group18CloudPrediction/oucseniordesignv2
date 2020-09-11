import React, { Component } from "react";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";

const videoOptions = {
  poster: icon,
};

const overlayOptions = {};

class Sub_29_Livestream extends Component {
  render() {
    return (
      <div id="Livestream">
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="ws://cloudtracking-v2.herokuapp.com/sub-29"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
      </div>

    );
  }
}

export default Sub_29_Livestream;
