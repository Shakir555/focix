// Modules
// Web Framework
const express = require('express');
// File System Module for reading / writing files
const fs = require('fs');
// Utility for handling file paths
const path = require('path');
// Middleware for session management
const session = require('express-session');
// Middleware to parse form-data
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
// Port Number for the server
const PORT = 3000;

// Middleware setup
// Serve static files from 'public' folder
app.use(express.static('public'));
// Parse URL-encoded form data
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  // Secret Key for session encryption
  secret: 'focix_secret',
  // Don't save session if unmodified
  resave: false,
  // Save new sessions even if empty
  saveUninitialized: true
}));

// Path to user data file
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to load users from JSON file
function loadUsers()
{
  if (!fs.existsSync(USERS_FILE))
  {
    // If file doesnt exist, return empty object
    return {}
  }
  // Read and parse user data
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Function to save users to JSON file
function saveUsers(users)
{
  // Write user data to file 
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Routes
// Redirect root url to login page
app.get('/', (req, res) => res.redirect('/login'));

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/register.html'));
})

// Serve dashboard page if user logged in
app.get('/dashboard', (req, res) => {
  // Redirect if no logged in
  if(!req.session.username)
  {
    return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
  // Get form data
  const {username, password} = req.body;
  // Load existing users
  const users = loadUsers();
  // Check for duplicate
  if (users[username])
  {
    return res.send('User already exists');
  }
  // Add New User
  users[username] = {password};
  // Save updated user list
  saveUsers(users);
  // Redirect to login page
  res.redirect('/login');
});

// Handle User Login
app.post('/login', (req, res) => {
  // Get form data
  const {username, password} = req.body;
  // Load Users
  const users = loadUsers();

  // Validate Credentials
  if (users[username] && users[username].password === password)
  {
    // Save username in session
    req.session.username = username;
    // Redirect to dashboard
    res.redirect('/dashboard');
  }
  else
  {
    // Show Error Message
    res.send('Invalid credentials');
  }
});

// Start the server
app.listen(PORT, () => console.log(`Focix App running on http://localhost:${PORT}`));
