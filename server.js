// server.js
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
require('./db'); // ✅ MongoDB connection
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

// Routes
const loginData = require("./routes/routes"); // GET pages
const routeRouter = require("./routes/app");  // POST login/signup

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'chat-app-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Routes middleware
app.use(loginData);
app.use(routeRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Protect /chat route with room validation
app.get('/chat', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const { username, room } = req.query;
  if (!username || !room) {
    return res.send("<script>alert('Invalid username or room'); window.location='/select-room';</script>");
  }

  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Socket.io handling
const botName = 'Bot';

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to Let\'s Chat'));

    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(botName, `${user.username} has joined the chat`)
    );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
