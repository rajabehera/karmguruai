
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- MOCK DATABASE (IN-MEMORY) ---
// In a real app, this would be MongoDB or PostgreSQL
const DB = {
  users: []
};

// --- HELPERS ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateToken = () => Math.random().toString(36).substr(2) + Date.now().toString(36);

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user exists
  const existingUser = DB.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create User
  const newUser = {
    id: generateId(),
    name,
    email,
    password, // NOTE: In a real app, hash this password (e.g., bcrypt)!
    plan: 'FREE',
    credits: {
      interviews: 2,
      aiAnalysis: 5
    },
    xp: 0,
    joinedDate: new Date().toLocaleDateString()
  };

  DB.users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ user: userWithoutPass, token: generateToken() });
});

// 2. LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = DB.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, token: generateToken() });
});

// 3. GET PROFILE
app.get('/api/user/profile', (req, res) => {
  // In a real app, you would verify the "Authorization" header token here
  const email = req.query.email; // Simple lookup for demo
  
  const user = DB.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password: _, ...userWithoutPass } = user;
  res.json(userWithoutPass);
});

// 4. UPGRADE PLAN
app.post('/api/user/upgrade', (req, res) => {
  const { email, plan } = req.body;
  
  const userIndex = DB.users.findIndex(u => u.email === email);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  // Update Plan
  DB.users[userIndex].plan = plan;
  DB.users[userIndex].credits = {
    interviews: -1, // Unlimited
    aiAnalysis: 50
  };

  const { password: _, ...userWithoutPass } = DB.users[userIndex];
  res.json({ success: true, user: userWithoutPass });
});

// 5. UPDATE XP (Gamification)
app.post('/api/user/xp', (req, res) => {
  const { email, xpAmount } = req.body;
  
  const user = DB.users.find(u => u.email === email);
  if (user) {
    user.xp += xpAmount;
    res.json({ success: true, newXp: user.xp });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
  console.log(`Mock Database initialized. Data will be lost on restart.`);
});