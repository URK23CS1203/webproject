const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { auth, adminAuth, auditorAuth, logAction } = require('../middleware/auth');

// @route   POST api/clients
// @desc    Create a new client
// @access  Private (Admin or Auditor)
router.post(
  '/',
  [auth, auditorAuth, logAction('CREATE_CLIENT')], // <-- THIS LINE IS CHANGED
  async (req, res) => {
    try {
      const newClient = new Client({
        ...req.body,
        assignedTo: req.user.id,
      });
      const client = await newClient.save();
      res.json(client);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/clients
// @desc    Get all clients
// @access  Private (Admin or Auditor)
router.get('/', [auth, auditorAuth], async (req, res) => {
  try {
    const clients = await Client.find().populate('assignedTo', 'email');
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/clients/:id
// @desc    Update a client
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth, logAction('UPDATE_CLIENT')], async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });

    client = await Client.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/clients/:id
// @desc    Delete a client
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth, logAction('DELETE_CLIENT')], async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });

    await Client.findByIdAndDelete(req.params.id);
    // TODO: Also delete associated tasks
    res.json({ msg: 'Client removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;