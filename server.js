const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'focix_secret',
  resave: false,
  saveUninitialized: true
}));

// Load users from JSON
const USERS_FILE = path.join(__dirname, 'users.json');
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views/register.html')));
app.get('/dashboard', (req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users[username]) return res.send('User already exists');
  users[username] = { password };
  saveUsers(users);
  res.redirect('/login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users[username] && users[username].password === password) {
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

app.listen(PORT, () => console.log(`Focix App running on http://localhost:${PORT}`));
