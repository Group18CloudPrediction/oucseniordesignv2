import React, { Component } from "react";
import { Nav,Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import icon from "../media/cloud.ico";

class Navigation extends Component {
  render () {
    return (
      <div id="nav">
        <div>
          <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href='/'>
              <img
                src= {icon}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Cloud Icon"
              />
            </Navbar.Brand>
              <Nav>
                <Nav.Link as={NavLink} href="/" to="/" exact>Home</Nav.Link>
                <Nav.Link as={NavLink} href="/archive" to="/archive">Archive</Nav.Link>
                <Nav.Link as={NavLink} href="/PowerPredictionsDashboard" to="/PowerPredictionsDashboard">Power Predictions Dashboard</Nav.Link>
                                
                <Nav.Link as={NavLink} href="/Sub_27" to="/Sub_27">Sub 27</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_28" to="/Sub_28">Sub 28</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_29" to="/Sub_29">Sub 29</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_33" to="/Sub_33">Sub 33</Nav.Link>



                <Nav.Link as={NavLink} href="/Sub/33" to="/Sub/33">(Sub 33 New Component Example)</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub/PLACEHOLDER_REPLACE" to="/Sub/PLACEHOLDER_REPLACE">(Test Data Station)</Nav.Link>

              </Nav>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default Navigation;
