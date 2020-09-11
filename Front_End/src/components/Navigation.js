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
                <Nav.Link as={NavLink} href="/livestream" to="/livestream">Livestream</Nav.Link>
                <Nav.Link as={NavLink} href="/livestream1" to="/livestream1">Livestream 1</Nav.Link>
                <Nav.Link as={NavLink} href="/livestream2" to="/livestream2">Livestream 2</Nav.Link>
                <Nav.Link as={NavLink} href="/livestream3" to="/livestream3">Livestream 3</Nav.Link>
              </Nav>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default Navigation;
