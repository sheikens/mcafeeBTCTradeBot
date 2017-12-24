const Twit = require('twit');
const names = require('./names.js');
const Poloniex = require('./poloniex');

const API_KEY = '';
const SECRET = '';

var IDChecked = [];
const safeCheck = true; //HIGHLY recomended~

/* See Documentation on poloniex.js */
const polo = new Poloniex(API_KEY, SECRET, 0.0001, 0);

const T = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

//961445378
var stream = T.stream('statuses/filter', { follow : '961445378' });

stream.on('tweet', (tweet, err) => {
    if (!isIn(tweet.id)) {
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
      if (text.includes(val.toLowerCase()) && text.toLowerCase().includes('coin of the day')) {
        console.log(`${text} :: ${val}`);
        polo.checkBalancesandBuy(val.toUpperCase());
      }
    }
  } else {
    for (var val of names) {
      if (text.includes(val)) {
        console.log(`${text} :: ${val}`);
        polo.checkBalancesandBuy(val.toUpperCase());
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

function validate(twitter_response) {
 let { in_reply_to_status_id, in_reply_to_status_id_str, in_reply_to_user_id, in_reply_to_user_id_str, in_reply_to_screen_name } = twitter_response;

 if (!in_reply_to_status_id && !in_reply_to_status_id_str && !in_reply_to_user_id && !in_reply_to_user_id_str && !in_reply_to_screen_name) {
   return true;
 } else {
   return false;
 }
}

/*
Test @ works Made Purchase {"orderNumber":"91514514058","resultingTrades":[{"amount":"0.00270000","date":"2017-12-24 ","rate":"0.03711015","total":"0.00010019","tradeID":"","type":"buy"}]}
//let a = 'zec coin of the day';

//checkTweet(a);
*/
