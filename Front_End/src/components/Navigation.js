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

                <Nav.Link as={NavLink} href="/Sub/27" to="/Sub/27">Sub 27</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub/28" to="/Sub/28">Sub 28</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub/29" to="/Sub/29">Sub 29</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub/33" to="/Sub/33">Sub 33</Nav.Link>

                <Nav.Link as={NavLink} href="/Sub/-1" to="/Sub/-1">Sub {"{TEST}"}</Nav.Link>


              </Nav>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default Navigation;
