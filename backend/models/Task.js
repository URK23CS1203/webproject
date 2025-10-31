const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Completed'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Task', TaskSchema);