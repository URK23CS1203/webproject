const mongoose = require('mongoose');
const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g., 'CREATE_CLIENT', 'UPDATE_TASK'
  details: { type: String }, // e.g., 'Client John Doe (ID: 123) was created'
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('AuditLog', AuditLogSchema);