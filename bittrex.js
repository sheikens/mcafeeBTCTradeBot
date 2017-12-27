const bittrex = require('node-bittrex-api');

/*
variance : If the price of the coin has risen over 'variance'% then the purchase wont execute. The idea here is to protect users who are
hosing the bot in a bad place so they dont end up buying with an inflated rate. Example 11 = 11% change. So if the coin has change is less than 11% for the day it will purchase.
markup : the % over the current price you are willing to pay incase other bots beat you. Example .01 = 1% markup
btcSpending: the amount of btc you want to spend on given coin
*/


class Bittrex {
  constructor(variance, markup, btcSpending) {
    this.bittrex = bittrex;
    this.bittrex.options({
      'apikey' : '',
      'apisecret' : ''
    });
    this.variance = variance; // 11 = 11% change in the day so anything under 11 is allowed
    this.markup = markup; // 0.01 = 1% markup
    this.btcSpending = btcSpending;
  }

  allowBuy(low, high) {
    let pctchange = (((high/low) - 1) * 100).toFixed(5);
    console.log(`PctChange: ${pctchange} :: Variance :: ${this.variance}`);
    return this.variance > pctchange;
  }

  getGeneralSummary() {
    return new Promise((resolve, reject) => {
      this.bittrex.getmarketsummaries((err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  getSpecificSummaryAndBuy(currencyPair) {
    let mkt = { market : `BTC-${currencyPair}`};
    this.bittrex.getmarketsummary(mkt, (data, err) => {
      if (this.allowBuy(low, high)) {
        let buyPrice = data.result[0].Ask + data.result[0].Ask * this.markup;
        this.buy(currencyPair, buyPrice);
      } else {
        console.log(`Buy Terminated :: Too much action`);
      }
    });
  }

  getOrderBook(currencyPair) {
    return new Promise((resulve, reject) => {
      let data = { market: `BTC-${currencyPair}`, depth: 3, type: 'sell'};
      this.bittrex.getorderbook(data, (data, err) => {
        err ? reject(err) : resolve(data);
      })
    })
  }

  buy(currencyPair, buyPrice) {
    let amtToPurchase = (this.btcSpending / buyPrice).toFixed(5);
    this.bittrex.tradebuy({
      MarketName: `BTC-${currencyPair}`,
      OrderType: 'LIMIT',
      Quantity: amtToPurchase,
      Rate: buyPrice,
      TimeInEffect: 'FILL_OR_KILL', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
      ConditionType: 'NONE',        // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
      Target: 0,                    // used in conjunction with ConditionType
    }, (buy, err) => {
      if (err) {
        console.log(`ERR in buy :: ${JSON.stringify(err)}`);
      } else {
        console.log(`Buy Success :: ${JSON.stringify(buy)}`);
      }
    });
  }

  sell() {
    return false; //dont have API key & registration is closed (need to see what callback buy is in buy :( );
  }
}

module.exports = Bittrex;
