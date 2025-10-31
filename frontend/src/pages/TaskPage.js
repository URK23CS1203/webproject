import React from 'react';
import { useParams } from 'react-router-dom';

const TaskPage = () => {
  const { clientId } = useParams();

  return (
    <div>
      <h1>Tasks for Client (ID: {clientId})</h1>
      <p>This is where you would show the list of tasks for this specific client.</p>
      {/* You would fetch tasks from /api/tasks/client/:clientId */}
    </div>
  );
};

export default TaskPage;