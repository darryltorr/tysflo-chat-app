
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath =path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io =socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New User has Connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
          return callback('Name and room name are required.');
        }


        //User Joins the chat.
        socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Tysflo chat. '));
    socket.emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat.`));
        callback();
      });


      //when creating message use user info
      socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
    
        if (user && isRealString(message.text)) {
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
    
        callback();
      });


      //when user leaves this removes them from the chat
    socket.on('disconnect', () => {
        
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    });
;})

server.listen(3000, () => {
    console.log(`Server is up on ${port}`);
});