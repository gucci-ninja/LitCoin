// Make connection for client-side
var socket = io.connect('http://localhost:4000');


//  P1IPN8JROHA6T8KB Alpha Vantage Key
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=BTC&market=CAD&apikey=P1IPN8JROHA6T8KB
// when someone clicks BUYY this will do something
var players = document.getElementById('players'); // output
var money = document.getElementById('money');
var scroll = document.getElementById('scroll');
var cryptodata = [];
var prices = [];
var changes = [];
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

// listen for events, when the backend finds out that click occured, frontend posts number
socket.on('playerson', function(data){
    players.innerHTML = '<p>Players online: '+data.players+'</p>';
});

socket.on('update', function(data){
    prices = data.prices;
    changes = data.changes;
    for (var i in coins){
        cryptodata.push({
            name: coins[i][1],
            symbol: coins[i][0],
            price: prices[i],
            change: changes[i],
            shares: 0
        });
    };
    var scroll_text = '';
    for (i = 0; i < cryptodata.length; i++){
        scroll_text += cryptodata[i].symbol + ' ' + cryptodata[i].price + ' | '
    };
    scroll.innerHTML = '<marquee scrollamount="20"><h1>'+scroll_text+'</h1></marquee>'
});

socket.on('connect', function(){
    
   // create data
   

   

    var total = 1000;    
    money.innerHTML = '<h1> Money: '+total+'</h1>';
    

    
    scroll.innerHTML = '<marquee scrollamount="20"><h1>'+prices[1]+'</h1></marquee>';
        // Make some API requests

   
    
});
