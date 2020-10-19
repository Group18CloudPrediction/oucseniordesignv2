// Import
import React, { Component } from "react";
import Map2 from "./CombinedMap"

// Class
class Home extends Component {

  // Render the following HTML
  render() {
    return(
      // Return the map component inside of the Home Div
      <div id="Home" className="homedisplay" style= {{ height: '92.5vh', width: '100%' }}>
        <Map2 />
      </div>
    );
  }
}

export default Home;
