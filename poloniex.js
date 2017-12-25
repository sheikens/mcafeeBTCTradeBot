const Poloniex = require('poloniex-api-node');

/*
  API_KEY     = the api key you recieve from the exchange poloniex;
  SECRET      = the secret you recieve from the exchange poloniex;
  buyAmount   = the amount of BTC you want to spend on the coin that was just tweeted about (min 0.000001);
  markup      = incase another bot gets a request in faster and clears the book, this lets you send a buy with a markup. Reccomended @ should be .01 - .05;
  resell      = set to either True or False .... True = you want the bot to automatically resell, False = you want to keep it so you can manually dump it
  sellmarkup  = If resell is set to true, it will resell at "boughtprice * sellmarkup", so setting this as 1.05 would result in a 5% markup
*/

class polo {
  constructor(API_KEY, SECRET, buyAmount, markup, resell, sellmarkup = 1) {
    this.API_KEY    = API_KEY;
    this.SECRET     = SECRET;
    this.buyAmount  = buyAmount;
    this.markup     = markup; //should be .01 - .05; ##IMPORTANT##
    this.resell     = resell
    this.sellmarkup = sellmarkup; /* 1.05 = 5% markup, 1.1 = 10% markup, 2 = 2x price. */
    this.poloniex   = new Poloniex(this.API_KEY, this.SECRET);
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
    this.poloniex.buy(currencyPair, buyprice, amount.toFixed(4), false, false, false)
    .then(result => {
      console.log(`Made Purchase ${JSON.stringify(result)}`);
      if (this.resell) {
        let amountPurchased = 0;
        for (let i = 0; i < result.resultingTrades.length; i++) {
          amountPurchased += result.resultingTrades[i].amount;
        }
        this.sell(buyprice, currencyPair, amountPurchased);
      }
    }).catch(err => console.log(err));
  }

  sell(sellprice, currencyPair, amount) {
    sellprice = sellprice * this.sellmarkup;
    console.log(`Selling now :: Sell price: ${sellprice} :: currencyPair: ${currencyPair} :: Amount : ${amount}`);
    this.poloniex.sell(currencyPair, sellprice, amount, false, false, false)
    .then(sell => console.log(sell))
    .catch(err => console.log(err));
  }
}


module.exports = polo;
