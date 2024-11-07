// Connect to the server
const socket = io();

// Get elements
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page refresh
  if (input.value) {
    socket.emit('chat message', input.value); // Send message to the server
    input.value = ''; // Clear input field
  }
});

// Receive messages from the server
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
