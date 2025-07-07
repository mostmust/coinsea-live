const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // ✅ BTC/USD 시세 가져오기 (CoinGecko)
    const btcRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const btcData = await btcRes.json();
    const btc = btcData.bitcoin.usd;

    // ✅ USD/KRW 환율 (Netlify Functions)
    const rateRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const rateData = await rateRes.json();
    const rate = rateData.krw;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ btc, rate })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "가격 정보를 불러올 수 없습니다." })
    };
  }
};
