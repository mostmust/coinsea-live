const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const [upbitRes, coingeckoRes, fxRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC"),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"),
      fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW")
    ]);

    const upbitData = await upbitRes.json();
    const coingeckoData = await coingeckoRes.json();
    const fxData = await fxRes.json();

    if (!Array.isArray(upbitData) || !upbitData[0]?.trade_price) {
      throw new Error("Invalid Upbit response: " + JSON.stringify(upbitData));
    }

    const upbitPrice = upbitData[0].trade_price;
    const binancePrice = coingeckoData.bitcoin.usd;
    const usdToKrw = fxData.rates.KRW;
    const binanceKrw = binancePrice * usdToKrw;
    const kimchiPremium = ((upbitPrice - binanceKrw) / binanceKrw) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPrice,
        binancePrice,
        usdToKrw,
        kimchiPremium: kimchiPremium.toFixed(2)
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
