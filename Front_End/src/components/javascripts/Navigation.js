import React, { Component } from 'react';
import { Nav,Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import icon from '../media/cloud.ico'

class Navigation extends Component {
  render () {
    return (
      <div id="nav">
        <div className="row">
          <div className="col-md-12">
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
                  <Nav.Link as={NavLink} href='/' to='/' exact>Home</Nav.Link>
                  <Nav.Link as={NavLink} href='/archive' to='/archive'>Archive</Nav.Link>
                  <Nav.Link as={NavLink} href='/livestream' to='/livestream'>Livestream</Nav.Link>
                </Nav>
            </Navbar>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
