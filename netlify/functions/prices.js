const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 업비트 BTC/USDT 시세
    const btcRes = await fetch("https://api.upbit.com/v1/ticker?markets=USDT-BTC");
    const btcData = await btcRes.json();
    const btc = btcData[0]?.trade_price;

    // USD → KRW 환율
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
