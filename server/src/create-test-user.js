import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Create a test user
const createTestUser = async () => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('bishal123', 10);
    
    // Create test user
    const testUser = {
      id: 1,
      name: 'Bishal',
      email: 'bishal@gmail.com',
      password: hashedPassword,
      bloodGroup: 'O+',
      phone: '1234567890',
      address: '123 Main St, City, Country'
    };
    
    // Create users array with test user
    const users = [testUser];
    
    // Write to file
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
    console.log('Test user created successfully!');
    console.log('Email: bishal@gmail.com');
    console.log('Password: bishal123');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Run the function
createTestUser(); 