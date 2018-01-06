const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath =path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io =socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('New User has Connected');

    socket.emit('newMessage', {
        from: "helen",
        text: "see you then",
        createdAt: 123456,
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected' );
    });
;})

server.listen(3000, () => {
    console.log(`Server is up on ${port}`);
});