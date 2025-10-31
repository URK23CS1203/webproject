import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        // --- This calls your new backend route ---
        const res = await axios.get('https://smartca-backend.onrender.com/api/tasks/assignedtome');
        setTasks(res.data);
      } catch (err) {
        setError('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyTasks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h1 className="mb-4">Tasks Assigned to Me</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Client</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.client?.name || 'N/A'}</td>
              <td>{task.title}</td>
              <td>
                <Badge bg={
                  task.status === 'Completed' ? 'success' :
                  task.status === 'In-Progress' ? 'warning' : 'secondary'
                }>
                  {task.status}
                </Badge>
              </td>
              <td>{formatDate(task.dueDate)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">You have no tasks assigned to you.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminTasksPage;