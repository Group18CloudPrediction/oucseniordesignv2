import React, { Component } from 'react';
import JsmpegPlayer from './LivestreamPlayer.js';

const videoOptions = {
  poster: '../media/cloud.png'
};

const overlayOptions = {};

class Livestream extends Component {

  render () {
    return (
      <div id="Livestream">
        <div id="Player">
          <JsmpegPlayer
            wrapperClassName="video-wrapper"
            videoUrl="ws://localhost:3000/stream"
            options={videoOptions}
            overlayOptions={overlayOptions}
          />
        </div>
      </div>
    );
  }
}

export default Livestream;
