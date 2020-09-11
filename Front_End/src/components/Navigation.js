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
                <Nav.Link as={NavLink} href="/Sub_27_Livestream" to="/Sub_27_Livestream">Sub 27</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_28_Livestream" to="/Sub_28_Livestream">Sub 28</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_29_Livestream" to="/Sub_29_Livestream">Sub 29</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_33_Livestream" to="/Sub_33_Livestream">Sub 33</Nav.Link>
              </Nav>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default Navigation;
