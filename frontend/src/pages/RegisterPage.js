import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Card, Row, Col, FormSelect } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // <-- 1. ADDED STATE
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- 2. ADDED VALIDATION CHECK ---
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Stop the function if passwords don't match
    }
    
    try {
      // 1. Register the new user
      await axios.post('/api/auth/register', { email, password, role });
      
      // 2. Log them in automatically
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to register');
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Register User</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </Form.Group>

              {/* --- 3. ADDED CONFIRM PASSWORD FIELD --- */}
              <Form.Group id="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.targe.value)}
                  required
                  minLength="6"
                />
              </Form.Group>

              <Form.Group id="role" className="mb-3">
                <Form.Label>Role</Form.Label>
                <FormSelect value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="client">Client</option>
                    <option value="auditor">Auditor</option>
                    <option value="admin-ca">Admin (CA)</option>
                </FormSelect>
              </Form.Group>
              <Button type="submit" className="w-100">Register</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;