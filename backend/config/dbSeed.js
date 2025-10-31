const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      // console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database with default users...');

    const salt = await bcrypt.genSalt(10);

    // 1. Create Admin (CA)
    const adminPassword = await bcrypt.hash('admin123', salt);
    await new User({
      email: 'admin@smartca.com',
      password: adminPassword,
      role: 'admin-ca',
    }).save();

    // 2. Create Auditor
    const auditorPassword = await bcrypt.hash('auditor123', salt);
    await new User({
      email: 'auditor@smartca.com',
      password: auditorPassword,
      role: 'auditor',
    }).save();

    // 3. Create Client
    const clientPassword = await bcrypt.hash('client123', salt);
    await new User({
      email: 'client@company.com',
      password: clientPassword,
      role: 'client',
    }).save();

    console.log('Default users created successfully!');
    console.log('--- LOGIN CREDENTIALS ---');
    console.log('Admin: admin@smartca.com (pass: admin123)');
    console.log('Auditor: auditor@smartca.com (pass: auditor123)');
    console.log('Client: client@company.com (pass: client123)');
    console.log('---------------------------');

  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

module.exports = seedDatabase;