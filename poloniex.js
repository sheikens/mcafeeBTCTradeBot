const Poloniex = require('poloniex-api-node');

/*
  API_KEY = the api key you recieve from the exchange poloniex;
  SECRET = the secret you recieve from the exchange poloniex;
  buyAmount = the amount of BTC you want to spend on the coin that was just tweeted about (min 0.000001);
  markup = incase another bot gets a request in faster and clears the book, this lets you send a buy with a markup. Reccomended @ should be .01 - .05;
*/

class polo {
  constructor(API_KEY, SECRET, buyAmount = 0.000001, markup = 0) {
    this.API_KEY   = API_KEY;
    this.SECRET    = SECRET;
    this.buyAmount = buyAmount;
    this.poloniex  = new Poloniex(this.API_KEY, this.SECRET);
    this.markup = markup; //should be .01 - .05; ##IMPORTANT##
  }

  checkBalancesandBuy(val) {
    this.poloniex.returnBalances()
    .then(balance => {
      if (balance.BTC >= this.buyAmount) {
        const currencyPair = `BTC_${val}`;
        this.poloniex.returnOrderBook(currencyPair, 1)
        .then(result => {
          let buyPrice = result.asks[0][0] + result.asks[0][0] * this.markup;
          this.buy(buyPrice, currencyPair);
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
  }

  buy(buyprice, currencyPair) {
    const amount = this.buyAmount / buyprice;
    console.log(amount);
    this.poloniex.buy(currencyPair, buyprice, amount.toFixed(4), false, false, false)
    .then(result => console.log(`Made Purchase ${JSON.stringify(result)}`))
    .catch(err => console.log(err));
  }
}

module.exports = polo;
