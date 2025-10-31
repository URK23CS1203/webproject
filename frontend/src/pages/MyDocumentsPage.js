import React from 'react';
import { Alert } from 'react-bootstrap';

const MyDocumentsPage = () => {
  return (
    <div>
      <h1 className="mb-4">My Documents</h1>
      <Alert variant="info">
        This is where your document upload and sharing module will be.
        <br />
        You can build this next by integrating with AWS S3 or Google Drive API, as planned in your project brief.
      </Alert>
    </div>
  );
};

export default MyDocumentsPage;