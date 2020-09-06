import React, { Component } from "react";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";

const videoOptions = {
  poster: icon,
};

const overlayOptions = {};

class Livestream extends Component {
  render() {
    return (
      <div id="Livestream">
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="ws://cloudtracking-v2.herokuapp.com/stream1"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
        {/*<JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="wss://cloudtracking-v2.herokuapp.com/stream2"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="wss://cloudtracking-v2.herokuapp.com/stream3"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="wss://cloudtracking-v2.herokuapp.com/stream4"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />*/}
      </div>

    );
  }
}

export default Livestream;
