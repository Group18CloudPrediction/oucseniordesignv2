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
          videoUrl=""
          options={videoOptions}
          overlayOptions={overlayOptions}
        />
      </div>
    );
  }
}

export default Livestream;
