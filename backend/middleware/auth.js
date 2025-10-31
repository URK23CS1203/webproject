const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');

// Standard Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin (CA) Role Middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin-ca') {
    return res.status(403).json({ msg: 'Access denied. Admin role required.' });
  }
  next();
};

// Auditor Role Middleware
const auditorAuth = (req, res, next) => {
  if (req.user.role !== 'admin-ca' && req.user.role !== 'auditor') {
    return res.status(403).json({ msg: 'Access denied. Auditor or Admin role required.' });
  }
  next();
};

// Audit Logger Middleware (Your "Auditory" Feature)
const logAction = (action) => (req, res, next) => {
  try {
    // Let the main action (e.g., creating a client) finish
    // We attach this *after* the main logic, on the response
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let details = `${req.method} request to ${req.originalUrl} by ${req.user.email}.`;
        
        // Add more detail if needed, e.g., from req.body
        if (req.body && req.body.name) details += ` Name: ${req.body.name}`;
        if (req.body && req.body.title) details += ` Title: ${req.body.title}`;

        await new AuditLog({
          user: req.user.id,
          action: action,
          details: details,
        }).save();
      }
    });

    next();
  } catch (err) {
    console.error('Audit log failed:', err.message);
    next(); // Don't block the main request
  }
};

module.exports = { auth, adminAuth, auditorAuth, logAction };