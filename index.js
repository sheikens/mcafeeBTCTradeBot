const Twit = require('twit');
const names = require('./names.js');
const Poloniex = require('./poloniex');

const API_KEY = '';
const SECRET = '';

var IDChecked = [];
const safeCheck = true; //HIGHLY recomended~

/* See Documentation on poloniex.js */
const polo = new Poloniex(API_KEY, SECRET, 0, 0);

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

/*
Test
let a = 'zec coin of the day';

checkTweet(a);
*/
