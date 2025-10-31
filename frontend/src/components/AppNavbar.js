import React, { useContext } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap'; // <-- 1. IMPORT FORM
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  // --- 2. GET THEME AND TOGGLE FUNCTION ---
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);

  const adminLinks = (
    <>
      <Nav.Link as={Link} to="/admin-tasks">My Tasks</Nav.Link>
      <Nav.Link as={Link} to="/clients">Clients</Nav.Link>
      <Nav.Link as={Link} to="/audit-logs">Audit Logs</Nav.Link>
    </>
  );

  const auditorLinks = (
    <>
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
      {/* --- 3. ADD THE TOGGLE SWITCH --- */}
      <Form.Check
        type="switch"
        id="theme-switch"
        label={theme === 'light' ? '🌙' : '☀️'}
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="text-white me-3" // 'text-white' makes label visible
      />
      
      <Navbar.Text className="d-none d-lg-inline me-3"> {/* Hide on small screens */}
        Signed in as: {user?.email} ({user?.role})
      </Navbar.Text>
      <Nav.Link onClick={logout}>Logout</Nav.Link>
    </>
  );

  const guestLinks = (
    <>
      {/* --- ADD TOGGLE FOR GUESTS TOO --- */}
      <Form.Check
        type="switch"
        id="theme-switch"
        label={theme === 'light' ? '🌙' : '☀️'}
        checked={theme ==='dark'}
        onChange={toggleTheme}
        className="text-white me-3"
      />
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/register">Register</Nav.Link>
    </>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top"> {/* Use bg="dark" so switch is visible */}
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
          <Nav className="ms-auto d-flex align-items-center">
            {user ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;