// Import required modules
const express = require('express'); // Web framework
const fs = require('fs'); // File system module for reading/writing files
const path = require('path'); // Utility for handling file paths
const session = require('express-session'); // Middleware for session management
const bodyParser = require('body-parser'); // Middleware to parse form data

// Initialize Express app
const app = express();
const PORT = 3000; // Port number for the server

// Middleware setup
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(session({
  secret: 'focix_secret', // Secret key for session encryption
  resave: false, // Don't save session if unmodified
  saveUninitialized: true // Save new sessions even if they're empty
}));

// Path to user data file
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to load users from JSON file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {}; // If file doesn't exist, return empty object
  return JSON.parse(fs.readFileSync(USERS_FILE)); // Read and parse user data
}

// Function to save users to JSON file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); // Write user data to file
}

// Routes

// Redirect root URL to login page
app.get('/', (req, res) => res.redirect('/login'));

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/register.html'));
});

// Serve dashboard page only if user is logged in
app.get('/dashboard', (req, res) => {
  if (!req.session.username) return res.redirect('/login'); // Redirect if not logged in
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body; // Get form data
  const users = loadUsers(); // Load existing users

  if (users[username]) return res.send('User already exists'); // Check for duplicate

  users[username] = { password }; // Add new user
  saveUsers(users); // Save updated user list
  res.redirect('/login'); // Redirect to login page
});

// Handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body; // Get form data
  const users = loadUsers(); // Load users

  // Validate credentials
  if (users[username] && users[username].password === password) {
    req.session.username = username; // Save username in session
    res.redirect('/dashboard'); // Redirect to dashboard
  } else {
    res.send('Invalid credentials'); // Show error message
  }
});

// Start the server
app.listen(PORT, () => console.log(`Focix App running on http://localhost:${PORT}`));
