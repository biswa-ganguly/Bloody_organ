import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize or load users from file
let users = [];
if (fs.existsSync(USERS_FILE)) {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    users = JSON.parse(data).users;
    console.log('Loaded users from file:', users.length);
  } catch (error) {
    console.error('Error loading users from file:', error);
    users = [];
  }
} else {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }));
  console.log('Created new users file');
}

// In-memory donor storage
const donors = [];
// In-memory transplant request storage
const transplantRequests = [];

// Helper function to save users to file
const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
    console.log('Saved users to file:', users.length);
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };

    users.push(user);
    saveUsers(); // Save to file
    console.log('New user registered:', { id: user.id, name: user.name, email: user.email });
    console.log('Current users:', users.map(u => ({ id: u.id, email: u.email })));

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      console.log('User not found:', email);
      console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User logged in successfully:', { id: user.id, email: user.email });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected route example
app.get('/api/users/profile', authenticateToken, (req, res) => {
  console.log('Profile request received for user:', req.user);
  console.log('Looking for user with ID:', req.user.id);
  console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
  
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    console.log('User not found in database. Available users:', users.map(u => ({ id: u.id, email: u.email })));
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    bloodGroup: user.bloodGroup || null,
    phone: user.phone || null,
    address: user.address || null
  });
});

// Donor profile endpoints
app.get('/api/donors/my-profile', authenticateToken, (req, res) => {
  console.log('Donor profile request received for user:', req.user);
  const donor = donors.find(donor => donor.userId === Number(req.user.id));
  console.log('Found donor:', donor);
  res.json(donor || null);
});

app.post('/api/donors/register', authenticateToken, (req, res) => {
  const { bloodGroup, organs, medicalHistory } = req.body;
  
  // Check if donor already exists
  const existingDonor = donors.find(donor => donor.userId === Number(req.user.id));
  if (existingDonor) {
    return res.status(400).json({ message: 'Donor profile already exists' });
  }
  
  // Create new donor profile
  const donor = {
    id: donors.length + 1,
    userId: Number(req.user.id),
    bloodGroup,
    organs,
    medicalHistory,
    registrationDate: new Date().toISOString(),
    status: 'active'
  };
  
  donors.push(donor);
  res.status(201).json(donor);
});

// Transplant request endpoints
app.get('/api/requests/my-requests', authenticateToken, (req, res) => {
  const userRequests = transplantRequests.filter(request => request.userId === req.user.id);
  res.json(userRequests);
});

app.post('/api/requests/create', authenticateToken, (req, res) => {
  const { organType, urgency, hospital, additionalInfo } = req.body;
  
  // Create new transplant request
  const request = {
    id: transplantRequests.length + 1,
    userId: req.user.id,
    organType,
    urgency,
    hospital,
    additionalInfo,
    requestDate: new Date().toISOString(),
    status: 'pending'
  };
  
  transplantRequests.push(request);
  res.status(201).json(request);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 