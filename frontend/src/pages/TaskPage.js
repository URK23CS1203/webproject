import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Modal, Form, FormSelect } from 'react-bootstrap';
import axios from 'axios';

// --- DEFINE YOUR LIVE BACKEND URL ---
// (Replace this with your actual Render.com backend URL)
const API_BASE_URL = 'https://smartca-backend.onrender.com';

const TaskPage = () => {
  const { clientId } = useParams(); // Get client ID from the URL
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the "Add Task" modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    status: 'Pending',
  });

  // --- Modal Show/Hide Functions ---
  const handleClose = () => {
    setShowModal(false);
    setFormData({ title: '', dueDate: '', status: 'Pending' }); // Reset form
  };
  const handleShow = () => setShowModal(true);

  // --- Fetch all tasks for this client ---
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      // --- USE THE LIVE URL ---
      const res = await axios.get(`${API_BASE_URL}/api/tasks/client/${clientId}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [clientId]); // It only re-creates if clientId changes

  useEffect(() => {
    fetchTasks();
  }, [clientId, fetchTasks]); // Add 'fetchTasks' to dependency array

  // --- Form Field Change Handler ---
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Form Submit Handler (Create New Task) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- USE THE LIVE URL ---
      const res = await axios.post(`${API_BASE_URL}/api/tasks`, {
        ...formData,
        client: clientId, // Add the client ID to the task
      });
      
      setTasks(prevTasks => [res.data, ...prevTasks]);
      handleClose(); // Close the modal
    } catch (err) {
      setError('Failed to create task.');
    }
  };
  
  // --- Handle changing the status of a task ---
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // --- USE THE LIVE URL ---
      const res = await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, { status: newStatus });
      
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: res.data.status } : task
      ));
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Button as={Link} to="/clients" variant="light" className="mb-3">
        &larr; Back to Clients
      </Button>
      <h1 className="mb-4">Task Management</h1>
      
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        Add New Task
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned By</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>
                <FormSelect
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{
                    backgroundColor: task.status === 'Completed' ? '#d1e7dd' : task.status === 'In-Progress' ? '#fff3cd' : '#e2e3e5',
                    fontWeight: 'bold',
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </FormSelect>
              </td>
              <td>{formatDate(task.dueDate)}</td>
              <td>{task.assignedTo?.email || 'N/A'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">No tasks found for this client.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* --- ADD NEW TASK MODAL --- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Task Title (e.g., "File GSTR-3B for June")</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <FormSelect
                name="status"
                value={formData.status}
                onChange={onChange}
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </FormSelect>
            </Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskPage;