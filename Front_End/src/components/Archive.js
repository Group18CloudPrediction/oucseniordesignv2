import React, { Component } from "react";
import TestAPICall from "./apiCallers/TestAPICall";
import TestMongodbAPICall from "./apiCallers/TestMongodbAPICall";

class Archive extends Component {
  render() {
    return (
      <div id="Archive">
        <h1> Archive page </h1>
        <TestAPICall />
        <TestMongodbAPICall />
      </div>
    );
  }
}

export default Archive;
