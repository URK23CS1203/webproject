import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="mb-4">Welcome to SmartCA, {user.email}!</h1>
      <p>Your role is: <strong>{user.role}</strong></p>

      <Row>
        {/* Admin and Auditor Links */}
        {(user.role === 'admin-ca' || user.role === 'auditor') && (
          <>
            <Col md={4} className="mb-3">
              <Card as={Link} to="/clients" className="text-decoration-none">
                <Card.Body className="text-center">
                  <Card.Title>Manage Clients</Card.Title>
                  <Card.Text>View, add, and edit client information.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card as={Link} to="/audit-logs" className="text-decoration-none">
                <Card.Body className="text-center">
                  <Card.Title>View Audit Logs</Card.Title>
                  <Card.Text>See all major actions taken in the system.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* Client-specific Links */}
        {user.role === 'client' && (
          <Col md={4} className="mb-3">
            <Card as={Link} to="/my-tasks" className="text-decoration-none">
              <Card.Body className="text-center">
                <Card.Title>View My Tasks</Card.Title>
                <Card.Text>See the status of all your compliance tasks.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <h3 className="mt-5">Next Steps:</h3>
      <p>You can now use this foundation to build the other modules from your brief, such as:</p>
      <ul>
        <li>Taxation Module</li>
        <li>Auditing Module (Data Upload & Analysis)</li>
        <li>Financial Management Module</li>
      </ul>
    </div>
  );
};

export default DashboardPage;