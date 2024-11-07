const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Use sessions to keep track of user data
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Route to handle login form submission
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  req.session.username = req.body.username;
  res.redirect('/');
});

// Middleware to check if the user is logged in
app.use((req, res, next) => {
  if (!req.session.username && req.path !== '/login') {
    return res.redirect('/login');
  }
  next();
});

// Route for the chat page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast when a new user connects
  socket.on('new user', (username) => {
    io.emit('chat message', `${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Log when a user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
