// Make connection for client-side
var socket = io.connect('http://localhost:4000');

//  P1IPN8JROHA6T8KB Alpha Vantage Key
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=BTC&market=CAD&apikey=P1IPN8JROHA6T8KB
// when someone clicks BUYY this will do something
var players = document.getElementById('players'); // output
var money = document.getElementById('money');
var scroll = document.getElementById('scroll');

// listen for events, when the backend finds out that click occured, frontend posts number
socket.on('playerson', function(data){
    players.innerHTML = '<p>Players online: '+data.players+'</p>';
});


socket.on('connect', function(){
    
    // Make some API requests
    
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

   var data = []
   // create data
   for (var i in coins){
       data.push({
           name: coins[i][1],
           symbol: coins[i][0],
           price: 1,
           shares: 0
       });
   };

    var total = 1000;    
    money.innerHTML = '<h1> Money: '+total+'</h1>';
    var scroll_text = '';
    for (i = 0; i < data.length; i++){
        scroll_text += data[i].symbol + ' ' + data[i].price + ' | '
    }

    scroll.innerHTML = '<marquee scrollamount="20"><h1>'+scroll_text+'</h1></marquee>';
    
});
