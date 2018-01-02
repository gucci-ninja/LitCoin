// this file is for server-side, index.html is for client side
var express = require('express');
var socket = require('socket.io');
var https = require('https');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Set up the app
var app = express();

// create server for sockets
var server = app.listen((process.env.PORT || 4000, function() {
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
    var changes = [];
    for (var i in info.RAW){
        var price = info.RAW[i].USD.PRICE;
        var open = info.RAW[i].USD.OPEN24HOUR;
        prices.push(price);
        changes.push(Math.round((price-open)*100/open * 10 ) / 10);
    }

    io.sockets.emit('update', {
        prices: prices,
        changes: changes
     });

};    
setInterval(get, 10000);

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