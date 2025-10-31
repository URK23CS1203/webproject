const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  pan: { type: String, unique: true, sparse: true },
  nameAsPerPAN: { type: String }, // <-- 1. FIELD ADDED HERE
  gstin: { type: String, unique: true, sparse: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', ClientSchema);