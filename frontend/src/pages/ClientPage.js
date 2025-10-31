// --- 1. IMPORT `useCallback` TO FIX THE WARNING ---
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

// --- 2. DEFINE YOUR LIVE BACKEND URL ---
// (Replace this with your actual Render.com backend URL)
const API_BASE_URL = 'https://smartca-backend.onrender.com';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    nameAsPerPAN: '', 
    gstin: ''
  });
  
  const { user } = useContext(AuthContext); 

  const handleClose = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', pan: '', nameAsPerPAN: '', gstin: '' });
  };
  const handleShow = () => setShowModal(true);

  // --- 3. WRAP fetchClients in useCallback ---
  // This fixes the 'exhaustive-deps' warning by making the function stable
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      
      // --- 4. USE THE LIVE URL ---
      const res = await axios.get(`${API_BASE_URL}/api/clients`);
      
      setClients(res.data);
    } catch (err) {
      setError('Failed to fetch clients.');
    } finally {
      setLoading(false);
    }
  }, []); // The dependency array is empty because it doesn't depend on props or state

  // --- Fetch All Clients ---
  useEffect(() => {
    fetchClients();
  }, [fetchClients]); // --- 5. ADD fetchClients AS A DEPENDENCY ---

  // --- Form Field Change Handler ---
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Form Submit Handler (Create New Client) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      // --- 6. USE THE LIVE URL ---
      const res = await axios.post(`${API_BASE_URL}/api/clients`, formData);
      
      setClients([res.data, ...clients]);
      handleClose();
      
    } catch (err) {
      setError('Failed to create client. Check PAN/GSTIN (must be unique).');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h1 className="mb-4">Client Management</h1>
      
      {(user.role === 'admin-ca' || user.role === 'auditor') && (
        <Button variant="primary" className="mb-3" onClick={handleShow}>
          Add New Client
        </Button>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>PAN</th>
            <th>Name as per PAN</th>
            <th>GSTIN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.pan}</td>
              <td>{client.nameAsPerPAN}</td>
              <td>{client.gstin}</td>
              <td>
                <Button as={Link} to={`/tasks/${client._id}`} variant="info" size="sm">
                  View Tasks
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- ADD NEW CLIENT MODAL --- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Client</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pan">
              <Form.Label>PAN</Form.Label>
              <Form.Control
                type="text"
                name="pan"
                value={formData.pan}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nameAsPerPAN">
              <Form.Label>Name as per PAN</Form.Label>
              <Form.Control
                type="text"
                name="nameAsPerPAN"
                value={formData.nameAsPerPAN}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="gstin">
              <Form.Label>GSTIN</Form.Label>
              <Form.Control
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={onChange}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Client
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientPage;