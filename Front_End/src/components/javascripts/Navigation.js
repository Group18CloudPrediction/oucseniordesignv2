import React, { Component } from 'react';
import {Nav,Navbar} from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

class Navigation extends Component {
  render () {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <Navbar bg="primary" variant="dark">
            <Navbar.Brand as={Link} href='/'to='/'>Cloud Tracking</Navbar.Brand>
              <Nav className='ml-auto'>
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
