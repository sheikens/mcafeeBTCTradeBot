const Twit = require('twit');
const names = require('./names.js');
const Poloniex = require('poloniex-api-node');


const API_KEY = '';
const SECRET = '';
let poloniex = new Poloniex(API_KEY, SECRET);

var IDChecked = [];
var CoinsDetected = [];
const safeCheck = true; //HIGHLY recomended~~!
const buyAmount = 0; //Amount must be at least 0.000001. This value in BTC




const T = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

var stream = T.stream('statuses/filter', { follow : '961445378' });

stream.on('tweet', (tweet, err) => {
    if (!isIn(tweet.id)) {
      checkTweet(tweet.text);
    } else {
      console.log(`Found tweet ${tweet.id} but it has already been processed`);
    }
})

function checkTweet(text){
  text = text.toLowerCase();
  if (safeCheck) {
    for (var val of names) {
      if (text.includes(val.toLowerCase()) && text.toLowerCase().includes('coin of the day')) {
        checkBalancesandBuy(val.toUpperCase());
      }
    }
  } else {
    for (var val of names) {
      if (text.includes(val)) {
        console.log(`Not safecheck and tweet is ${text}`);
      }
    }
  }
}

function isIn(id) {
  for (var val of IDChecked) {
    if (val === id) {
      return true;
    }
  }
  IDChecked.push(id);
  return false;
}


function checkBalancesandBuy(val) {
  poloniex.returnBalances((err, balance) => {
    if (err) throw err;
    if (balance.BTC >= buyAmount) {
      const currencyPair = `BTC_${val}`;
      poloniex.returnOrderBook(currencyPair, 1, (err, result) => {
        if (err) throw err;
        let buyPrice = result.asks[0][0]; //might want to increase by a fraction of a percent.
        buy(buyPrice, currencyPair);
      })
    }
  })
}

function buy(buyprice, currencyPair) {
  //buy(currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback]) ; feel free to change settings to make it safer

  const amount = buyAmount / buyprice;
  poloniex.buy(currencyPair, buyprice, amount, false, false, false, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`MADE PURCHASE ${result}`);
    }
  });
}
/* test
let a = 'zec coin of the day';

checkTweet(a);
*/
