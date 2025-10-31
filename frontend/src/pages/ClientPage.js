import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- States for the Modal Form ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    nameAsPerPAN: '', // Field for "Name as per PAN"
    gstin: ''
  });
  
  const { user } = useContext(AuthContext); // Get the logged-in user

  // --- Modal Show/Hide Functions ---
  const handleClose = () => {
    setShowModal(false);
    // Reset form data when closing
    setFormData({ name: '', email: '', phone: '', pan: '', nameAsPerPAN: '', gstin: '' });
  };
  const handleShow = () => setShowModal(true);

  // --- Fetch All Clients ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/clients');
        setClients(res.data);
      } catch (err) {
        setError('Failed to fetch clients.');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // --- Form Field Change Handler ---
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Form Submit Handler (Create New Client) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the new client data to the backend
      const res = await axios.post('/api/clients', formData);
      
      // Add the new client to the top of the list in real-time
      setClients([res.data, ...clients]);
      
      // Close the modal
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
      
      {/* --- THIS IS THE "ADD NEW CLIENT" BUTTON --- */}
      {/* It only appears if you are logged in as 'admin-ca' */}
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
                {/* You can add Edit/Delete buttons here for Admins */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- THIS IS THE "ADD NEW CLIENT" POP-UP FORM (MODAL) --- */}
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