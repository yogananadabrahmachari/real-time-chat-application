// Connect to socket.io server
const socket = io("https://snapshot-realtime-chat.onrender.com");

// Use different names to avoid duplicate declaration!
const { username: uname, room: rname } = window.USER;

console.log('Client USER:', uname, rname);

socket.emit('joinRoom', { username: uname, room: rname });

// DOM elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// Listen for messages from server
socket.on('message', message => {
  console.log('Message:', message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Update room + users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Send message
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value.trim();
  if (!msg) return;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Helpers
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  usersList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.username;
    usersList.appendChild(li);
  });
}
