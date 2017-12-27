// this file is for server-side, index.html is for client side
var express = require('express');
var socket = require('socket.io');
var https = require('https');
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
var to = 'USD';

// Supply the data for prices, change in currency, 
https.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+from+'&tsyms=USD', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
  
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
  
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        var info = parsedData;
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

  

// when connection is made, function is called
// index.html -> runs stocks.js -> makes connection 
io.on('connection', function(socket) {
    console.log("made socket connection", socket.id);
    // adds to the players online counter
    io.sockets.emit('playerson', {
        players: ++players
    });
    var prices = [0,1,2,3,4,5,6,7,8,9];
    var changes = [0,1,2,3,4,5,6,7,8,9];
    
    io.sockets.emit('update', {
      prices: prices,
      changes: changes
      });
      console.log(prices[1]);
    
    socket.on('disconnect', function(){
        io.sockets.emit('playerson', {
            players: --players
        });
    });
});