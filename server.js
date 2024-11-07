const express = require('express'); // This should appear only once
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io connection setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);
    io.emit('chat message', msg); // Broadcast the message to all connected users
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
