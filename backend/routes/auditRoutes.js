const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { auth, auditorAuth } = require('../middleware/auth');

// @route   GET api/audit
// @desc    Get all audit logs
// @access  Private (Admin or Auditor)
router.get('/', [auth, auditorAuth], async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'email role')
      .sort({ timestamp: -1 }); // Newest first
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;