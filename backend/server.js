require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedDatabase = require('./config/dbSeed');

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('FATAL ERROR: MONGO_URI is not set in .env file.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    
    // --- Seed database with default users ---
    await seedDatabase();

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.get('/', (req, res) => res.send('SmartCA API Running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/audit', require('./routes/auditRoutes')); // The "auditory" module

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
