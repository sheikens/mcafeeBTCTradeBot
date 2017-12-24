const axios = require('axios');

const names = [];

axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=500')
  .then((response) => {
    response.data.forEach(item => {
      names.push(item.symbol);
    })
  });

setTimeout(() => {
  console.log(JSON.stringify(names))
}, 2000);


// node getNames.js > names.txt
