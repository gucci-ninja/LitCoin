// Make connection for client-side
var socket = io.connect('http://localhost:4000');

// DOM elements
var players = document.getElementById('players'); // output
var money = document.getElementById('money');
var scroll = document.getElementById('scroll');

// All coins
var coins = [
    ['BTC', 'Bitcoin'], 
    ['ETH', 'Ethereum'],
    ['LTC', 'Litecoin'],
    ['XRP', 'Ripple'],
    ['DASH', 'Dash'],
    ['XMR', 'Monero'],
    ['OMG', 'OmiseGO'],
    ['DOGE', 'Dogecoin'],
    ['NXT', 'Nxt'],
    ['ZEC', 'ZCash'],
];

var cryptodata = [];
for (i = 0; i < coins.length; i++){
    cryptodata.push({
        name: coins[i][1],
        symbol: coins[i][0],
        owned: 0.0
    });
};



// listen for events, when the backend finds out that click occured, frontend posts number
socket.on('playerson', function(data){
    players.innerHTML = '<p>Players online: '+data.players+'</p>';
});

socket.on('update', function(data){
    var prices = data.prices;
    var changes = data.changes;
    var scroll_text = '';
    for (i = 0; i < cryptodata.length; i++){
        var colour = '';
        if (changes[i]>=0){
            colour = '##7CFC00';
        }
        else  {
            colour = 'red';
        }
        scroll_text += cryptodata[i].symbol + ' ' + prices[i] + '<font color="'+colour+'"> '+changes[i]+'</font> | ';
    };
    scroll.innerHTML = '<marquee BEHAVIOR="alternate" SCROLLAMOUNT="4"><strong>'+scroll_text+'</strong></marquee>'
});


socket.on('connect', function(){
    
   // create data
    var total = 1000;    
    money.innerHTML = '<h1> Money: '+total+'</h1>';
    
});
