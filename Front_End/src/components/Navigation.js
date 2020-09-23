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
<<<<<<< HEAD
                <Nav.Link as={NavLink} href="/livestream" to="/livestream">Livestream</Nav.Link>
                <Nav.Link as={NavLink} href="/livestream1" to="/livestream1">Livestream 1</Nav.Link>
                <Nav.Link as={NavLink} href="/PowerPredictionsDashboard" to="/PowerPredictionsDashboard">Power Predictions Dashboard</Nav.Link>
=======
                <Nav.Link as={NavLink} href="/Sub_27" to="/Sub_27">Sub 27</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_28" to="/Sub_28">Sub 28</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_29" to="/Sub_29">Sub 29</Nav.Link>
                <Nav.Link as={NavLink} href="/Sub_33" to="/Sub_33">Sub 33</Nav.Link>
>>>>>>> 88c512fc2aaa9abf81c329591249d2abc12742c9
              </Nav>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default Navigation;
