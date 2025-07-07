const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 BTC/KRW 시세
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData[0].trade_price;

    // 2. CoinGecko에서 BTC/USD 시세
    const geckoRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const geckoData = await geckoRes.json();
    const btcUSD = geckoData.bitcoin.usd;

    // 3. 환율 (USD→KRW)
    const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const fxData = await fxRes.json();
    const exchangeRate = fxData.rates.KRW;

    // 4. 계산
    const btcUSD_KRW = btcUSD * exchangeRate;
    const kimchi = ((upbitPrice - btcUSD_KRW) / btcUSD_KRW) * 100;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        upbitPriceKRW: Math.round(upbitPrice),
        btcPriceUSD: btcUSD.toFixed(2),
        exchangeRate: exchangeRate.toFixed(2),
        btcPriceKRW: Math.round(btcUSD_KRW),
        kimchiPremium: kimchi.toFixed(2) + "%"
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: err.message
      })
    };
  }
};
