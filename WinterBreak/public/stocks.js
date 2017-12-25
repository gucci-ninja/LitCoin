// Make connection for client-side
var socket = io.connect('http://localhost:4000');

//  P1IPN8JROHA6T8KB Alpha Vantage Key
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_INTRADAY&symbol=BTC&market=CAD&apikey=P1IPN8JROHA6T8KB
// when someone clicks BUYY this will do something
var players = document.getElementById('players'); // output


// listen for events, when the backend finds out that click occured, frontend posts number
socket.on('playerson', function(data){
    players.innerHTML = '<p>Players online: '+data.players+'</p>';
});


$(function(){
    console.log('hello');
})