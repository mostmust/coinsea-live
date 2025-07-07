const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await response.json();
    const price = data.bitcoin.usd;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ price })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "CoinGecko 시세 불러오기 실패" })
    };
  }
};
