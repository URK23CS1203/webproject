const Client = require('../models/Client');
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, auditorAuth, logAction } = require('../middleware/auth');

// @route   POST api/tasks
// @desc    Create a new task for a client
// @access  Private (Admin or Auditor)
router.post(
  '/',
  [auth, auditorAuth, logAction('CREATE_TASK')],
  async (req, res) => {
    try {
      const newTask = new Task({
        ...req.body,
        assignedTo: req.user.id, // Assign to the person creating it
      });
      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/tasks/client/:clientId
// @desc    Get all tasks for a specific client
// @access  Private (Admin or Auditor)
router.get('/client/:clientId', [auth, auditorAuth], async (req, res) => {
  try {
    const tasks = await Task.find({ client: req.params.clientId })
      .populate('client', 'name')
      .populate('assignedTo', 'email');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task (e.g., change status)
// @access  Private (Admin or Auditor)
router.put('/:id', [auth, auditorAuth, logAction('UPDATE_TASK')], async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        
        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/mytasks
// @desc    Get all tasks for the logged-in client
// @access  Private (Client only)
router.get('/mytasks', auth, async (req, res) => {
  try {
    // 1. Find the Client profile that matches the logged-in user's email
    // This is the link between the login (User) and the company (Client)
    const clientProfile = await Client.findOne({ email: req.user.email });

    if (!clientProfile) {
      // If no client profile matches their login, they have no tasks
      return res.json([]); 
    }

    // 2. Find all tasks for that client's ID
    const tasks = await Task.find({ client: clientProfile._id })
      .populate('assignedTo', 'email') // Show which CA/Auditor assigned it
      .sort({ dueDate: 1 }); // Sort by due date
      
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/assignedtome
// @desc    Get all tasks assigned to the logged-in admin or auditor
// @access  Private (Admin or Auditor)
router.get('/assignedtome', [auth, auditorAuth], async (req, res) => {
  try {
    // Find all tasks assigned to the logged-in user's ID
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('client', 'name email') // Show which client it's for
      .sort({ dueDate: 1 });
      
    res.json(tasks);
  } catch (err) { // <-- THE BUG WAS HERE (missing braces)
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;