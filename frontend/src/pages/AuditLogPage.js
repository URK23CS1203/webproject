import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/audit');
        setLogs(res.data);
      } catch (err) {
        setError('Failed to fetch audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatDate = (dateString) => {
     return new Date(dateString).toLocaleString();
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h1 className="mb-4">System Audit Logs ("Auditory")</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{formatDate(log.timestamp)}</td>
              <td>{log.user?.email || 'N/A'}</td>
              <td>{log.user?.role || 'N/A'}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AuditLogPage;