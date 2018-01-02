// Make connection for client-side
var socket = io.connect('http://localhost:4000');

// DOM elements
var players = document.getElementById('players'); // output
var money = document.getElementById('money');
var scroll = document.getElementById('scroll');
var buy = document.getElementById('buy');
var sell = document.getElementById('sell');
var buying = document.getElementById('buying');
var buyNum = document.getElementById('buyNum');
var spending = document.getElementById('spending');
var total = 1000;
var pVal = 0;
var prices = [];

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

// Populate cryptodata with the coin names and how much of each the player owns
var cryptodata = [];
for (i = 0; i < coins.length; i++){
    cryptodata.push({
        name: coins[i][1],
        symbol: coins[i][0],
        owned: 0.0
    });
};

// When the server knows someone has connected, it emits an update for players online
socket.on('playerson', function(data){
    players.innerHTML = '<p>Players online: '+data.players+'</p>';
});

// Updates the ticker with new prices after server fetches data
socket.on('update', function(data){
    // data will consist of 2 arrays, prices and changes
     prices = data.prices;
    var changes = data.changes;
    pVal = 0;
    // Initializze the text that will scroll across the top 
    var scroll_text = '';
    // For each coin, add the updated price and change the past day
    for (i = 0; i < cryptodata.length; i++){
        var colour = ''; // figure out if the coin has increased/decreased in value
        if (changes[i]>=0){
            colour = '##7CFC00'; // bright green
        }
        else  {
            colour = 'red';
        }
        scroll_text += cryptodata[i].symbol + ' ' + prices[i] + '<font color="'+colour+'"> '+changes[i]+'</font> | ';
        pVal += cryptodata[i].owned*prices[i];
    };
    // Change the HTML element by adding scroll_text
    scroll.innerHTML = '<marquee BEHAVIOR="alternate" SCROLLAMOUNT="4"><strong>'+scroll_text+'</strong></marquee>'
    portfolio.innerHTML = '<h1> Portfolio Value: '+pVal+'</h1>';
});

// On connect, add all the necessary numbers such as money
socket.on('connect', function(){   
    money.innerHTML = '<h1> Money: '+total+'</h1>';
    portfolio.innerHTML = '<h1> Portfolio Value: '+pVal+'</h1>';
    spending.innerHTML = '<strong>0.0 USD </strong>';
    
});

buyNum.onkeyup = function(){
    for (var c1 in cryptodata){
        if(cryptodata[c1].symbol === buying.value){
            var usd = parseFloat(buyNum.value)*prices[c1];
            break;
        }
    }
    spending.innerHTML = '<strong>'+usd+' USD </strong>';
}
// listen for 'buy' event, when the backend finds out that click occured
buy.addEventListener('click', function(){
    for (var c in cryptodata){
        if (cryptodata[c].symbol === buying.value) {
            cryptodata[c].owned += parseFloat(buyNum.value);
            total = total - prices[c]*parseFloat(buyNum.value);
            money.innerHTML = '<h1> Money: '+total+'<h1>';
            break;
        }
    }
});
    