    import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        // This calls the new API route we just made
        const res = await axios.get('https://smartca-backend.onrender.com/api/tasks/mytasks');
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
      <h1 className="mb-4">My Compliance Tasks</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned By (CA/Auditor)</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? tasks.map((task) => (
            <tr key={task._id}>
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
              <td>{task.assignedTo?.email || 'N/A'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">You have no tasks assigned.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MyTasksPage;