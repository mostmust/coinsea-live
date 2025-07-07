const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 업비트 BTC 가격 (KRW)
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPriceKRW = upbitData[0].trade_price;

    // 바이낸스 BTC 가격 (USDT)
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const binanceData = await binanceRes.json();
    const binancePriceUSDT = parseFloat(binanceData.price);

    // 환율 (USD → KRW)
    const fxRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const fxData = await fxRes.json();
    const exchangeRate = fxData.rates.KRW;

    // 김치 프리미엄 계산
    const binancePriceKRW = binancePriceUSDT * exchangeRate;
    const kimchiPremium = ((upbitPriceKRW - binancePriceKRW) / binancePriceKRW) * 100;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        upbitPriceKRW,
        binancePriceUSDT,
        exchangeRate,
        binancePriceKRW,
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
