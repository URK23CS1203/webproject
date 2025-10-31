import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);

  const adminLinks = (
    <>
      {/* --- ADD THIS NEW LINK --- */}
      <Nav.Link as={Link} to="/admin-tasks">My Tasks</Nav.Link>
      
      <Nav.Link as={Link} to="/clients">Clients</Nav.Link>
      <Nav.Link as={Link} to="/audit-logs">Audit Logs</Nav.Link>
    </>
  );

  const auditorLinks = (
    <>
      {/* --- ADD THIS NEW LINK --- */}
      <Nav.Link as={Link} to="/admin-tasks">My Tasks</Nav.Link>
      
      <Nav.Link as={Link} to="/clients">Clients</Nav.Link>
      <Nav.Link as={Link} to="/audit-logs">Audit Logs</Nav.Link>
    </>
  );

  const clientLinks = (
    <>
      <Nav.Link as={Link} to="/my-tasks">My Tasks</Nav.Link>
      <Nav.Link as={Link} to="/my-documents">My Documents</Nav.Link>
    </>
  );

  const authLinks = (
    <>
      <Navbar.Text>Signed in as: {user?.email} ({user?.role})</Navbar.Text>
      <Nav.Link onClick={logout} className="ms-3">Logout</Nav.Link>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
    </>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">SmartCA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && <Nav.Link as={Link} to="/">Dashboard</Nav.Link>}
            {user?.role === 'admin-ca' && adminLinks}
            {user?.role === 'auditor' && auditorLinks}
            {user?.role === 'client' && clientLinks}
          </Nav>
          <Nav className="ms-auto">
            {user ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;