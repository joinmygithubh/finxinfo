const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://mehzhaya:DubrAJ9tPtR4Y2XO@cluster0.wccwe4o.mongodb.net/quickadvisorusa?retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB Atlas.');

    const defaultEmail = 'admin@quickadvisorusa.com';
    const defaultPassword = 'Admin@QuickAdvisor2025!';

    const existingAdmin = await Admin.findOne({ email: defaultEmail });
    if (existingAdmin) {
      console.log(`[Seed] Default admin (${defaultEmail}) already exists. Skipping.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    await Admin.create({
      name: 'QuickAdvisor Executive Admin',
      email: defaultEmail,
      passwordHash,
      role: 'superadmin',
    });

    console.log('----------------------------------------------------');
    console.log(' Default Admin Account Created Successfully:');
    console.log(` Email:    ${defaultEmail}`);
    console.log(` Password: ${defaultPassword}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;

