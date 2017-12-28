// this file is for server-side, index.html is for client side
var express = require('express');
var socket = require('socket.io');
var https = require('https');
var async = require('async');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
var from = 'BTC,ETH,LTC,XRP,DASH,XMR,OMG,DOGE,NXT,ZEC';

var info = '';
// Supply the data for prices, change in currency, 
function get() {
    https.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+from+'&tsyms=USD', (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (d) => {
            rawData += d;
        });
        res.on('end', () => {
            try {
                info = JSON.parse(rawData);
                console.log(info);
            } catch (e) {
                console.error(e.message);
            }
        });
      }).on('error', (e) => {
        console.error(e);
      });
    setTimeout(update, 2000);
};

function update(){
    var prices = [];
    for (var i in info.RAW){
        prices.push(info.RAW[i].USD.PRICE);
    }
    console.log(prices[1]);
    io.sockets.emit('update', {
        prices: prices,
     });

};    
setInterval(get, 22000);

// when connection is made, function is called
// index.html -> runs stocks.js -> makes connection 
io.on('connection', function(socket) {
    console.log("made socket connection", socket.id);
    get();
    

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