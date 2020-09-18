import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import JsmpegPlayer from "./LivestreamPlayer.js";
import icon from "../media/cloud.png";
import CoverageMap from "./CoverageMap.js";
import { subscribeToCoverageData, subscribeToData } from "./apiCallers/api.js";

const videoOptions = {
  poster: icon,
};

const overlayOptions = {};

class Sub_27 extends Component {
  constructor(props) {
    super(props);

    subscribeToData((err, data) => {
      this.setState(data);
      this.setState({ time: new Date() });
    });

    subscribeToCoverageData((err, data) => {
      this.setState(data);
    });
  }

  render() {
    return (
      <Row noGutters="true">
        <Col
          sm={4}
          style={{
            backgroundColor: "ghostwhite",
            width: "100%",
            height: "auto",
          }}
        >
          <div id="Livestream">
            <JsmpegPlayer
              wrapperClassName="video-wrapper"
              videoUrl="ws://cloudtracking-v2.herokuapp.com/sub-27"
              options={videoOptions}
              overlayOptions={overlayOptions}
            />
            <h1>Sub_28</h1>
          </div>
        </Col>
        <Col sm={8}>
          <Card border="light">
            <Card.Body>
              <React.Fragment>
                <CoverageMap />
              </React.Fragment>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Sub_27;
