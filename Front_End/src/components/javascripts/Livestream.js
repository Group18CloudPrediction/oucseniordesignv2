import React, { Component } from 'react';
import JsmpegPlayer from './LivestreamPlayer.js';
import icon from '../media/cloud.png';

const videoOptions = {
  poster: icon
};

const overlayOptions = {};

class Livestream extends Component {
  render () {
    return (
      <div id="Livestream">
        <JsmpegPlayer
          wrapperClassName="video-wrapper"
          videoUrl="ws://localhost:3001/stream"
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
        <div>
          <h1>Livestream 1</h1>
        </div>
      </div>
    );
  }
}

export default Livestream;
