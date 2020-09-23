import React, { Component } from "react";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";

const videoOptions = {
  poster: icon,
};

const overlayOptions = {};

class Sub_27 extends Component {
  render() {
    return (
      <div id="Livestream">
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="ws://cloudtracking-v2.herokuapp.com/sub-27"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
        <h1>Sub_27</h1>
      </div>
    );
  }
}

export default Sub_27;
