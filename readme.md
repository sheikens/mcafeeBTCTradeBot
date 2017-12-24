Hello,

Welcome to my project, feel free to send me an email at nate_km@protonmail.com.

Support for more exchanges coming soon!

Feel free to send me a Bitcoin Cash donation here (1NLkGPnNbT9iCJ35U9UfsURANtYgNREVtq)
or email me if you want to send me something else and I will respond with an address.

How to use:

  This monitors a users twitter stream (instant) and acts on every
  tweet that It sees. It is currently pointed at the correct one.

  You must CD into directory and type "npm install" (make sure npm & node.js is installed). You must give it your API_KEY and Secret on line (6 & 7) from Poloniex to make buys, you must also get your twitter keys here
  https://apps.twitter.com/ and add it to the app. I highly advising removing big name coins from names.js just to play it safe. The buyAmount (on line 13). Is the BTC value of the coin you want to purchase. If your buyAmount is greater than the balance of BTC you have on Poloniex it will not purchase so be careful. To start bot type "node index.js"

  SafeCheck checks to make sure it is actually his tweet of the day and not some random tweet about another altcoin. I recommend to use it however you may miss something by using it. Its a gamble just like investing in crypto.
