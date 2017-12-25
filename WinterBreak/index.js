// this file is for server-side, index.html is for client side
var express = require('express');
var socket = require('socket.io');

// Set up the app
var app = express();

// create server for sockets
var server = app.listen(4000, function() {
    console.log("Listening to request on port 4000")
});

// static files, everything in this folder shall get served
app.use(express.static('public'));

// socket set up, parameter = server we want to work with
var io = socket(server);
var players = 0;
// when connection is made, function is called
// index.html -> runs stocks.js -> makes connection 
io.on('connection', function(socket) {
    console.log("made socket connection", socket.id);
    // adds to the players online counter
    io.sockets.emit('playerson', {
        players: ++players
    });
    socket.on('disconnect', function(){
        io.sockets.emit('playerson', {
            players: --players
        });
    });
});