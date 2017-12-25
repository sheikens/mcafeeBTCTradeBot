const Twit = require('twit');
const names = require('./names.js');
const Poloniex = require('./poloniex');

const API_KEY = '';
const SECRET = '';

var IDChecked = [];     /* Dont Change this value */
var CoinsBought = [];   /* Dont Change this value */
const safeCheck = true; //HIGHLY recomended~

const buyAmount = 0.0008;   /* Change this value to the amount you want to purchase for example 0.01 will purchase 0.01BTC worth of coin */
const markup = 0;           /* % over market you want to send an order for incase other bot beats you */
const resell = true;        /* set true if you want the bot to immediately resell the shitcoin, false if you want to hodl said shitcoin */
const sellMarkup = 1;    /* markup you want the bot to sell it at for example 1.15 will resell at purchased price + 15% */
/* See Documentation on poloniex.js */
/* constructor(API_KEY, SECRET, buyAmount, markup, resell, sellmarkup = 1) */
const polo = new Poloniex(API_KEY, SECRET, buyAmount, markup, resell, sellMarkup);

const T = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

//961445378

var stream = T.stream('statuses/filter', { follow : '961445378' });

stream.on('tweet', (tweet, err) => {
    if (!isIn(tweet.id, IDChecked)) {
      if (tweet.user.id_str === '961445378') {
        if (validate(tweet)) {
          checkTweet(tweet.text);
        } else {
          console.log('Bad Tweet, IGNORING')
        }
      }
    } else {
      console.log(`Found tweet ${tweet.id} but it has already been processed`);
    }
})


function checkTweet(text){
  text = text.toLowerCase();
  if (safeCheck) {
    for (var val of names) {
      val = val.toLowerCase();
      if (text.includes(val) && text.includes('coin of the day')) {
        console.log(`${text} :: ${val}`);
        if (!isIn(val, CoinsBought)) {
          polo.checkBalancesandBuy(val.toUpperCase());
        }
      }
    }
  } else {
    for (var val of names) {
      val = val.toLowerCase();
      if (text.includes(val)) {
        console.log(`${text} :: ${val}`);
        if (!isIn(val, CoinsBought)) {
          polo.checkBalancesandBuy(val.toUpperCase());
        }
      }
    }
  }
}

function isIn(id, array) {
  for (var val of array) {
    if (val === id) {
      return true;
    }
  }
  array.push(id);
  return false;
}

function validate(twitter_response) {
 let { in_reply_to_status_id, in_reply_to_status_id_str, in_reply_to_user_id, in_reply_to_user_id_str, in_reply_to_screen_name } = twitter_response;

 if (!in_reply_to_status_id && !in_reply_to_status_id_str && !in_reply_to_user_id && !in_reply_to_user_id_str && !in_reply_to_screen_name) {
   return true;
 } else {
   console.log('Tweet is not valid');
   return false;
 }
}

/*
test
let string = 'coin of the day xrp';
checkTweet(string);
coin of the day xrp :: xrp
Made Purchase {"orderNumber":"103638560814","resultingTrades":[{"amount":"11.05890000","date":"2017-12-25 22:24:37","rate":"0.00007234","total":"0.00080000","tradeID":"16945027","type":"buy"}]}
Selling now :: Sell price: 0.00007234 :: currencyPair: BTC_XRP :: Amount : 011.05890000
{ orderNumber: '103638566808', resultingTrades: [] }
*/
