const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 업비트 KRW-BTC 시세
    const resUpbit = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await resUpbit.json();
    const upbitPrice = upbitData[0].trade_price;

    // 바이비트 BTCUSDT 시세 (User-Agent 헤더 추가)
    const resBybit = await fetch("https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const bybitJson = await resBybit.json();
    const bybitPrice = parseFloat(bybitJson.result.list[0].lastPrice);

    // 환율
    const exchangeRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const exchangeData = await exchangeRes.json();
    const rate = exchangeData.rates.KRW;

    const bybitKRW = bybitPrice * rate;
    const kimchiPremium = ((upbitPrice - bybitKRW) / bybitKRW) * 100;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        upbitPriceKRW: Math.round(upbitPrice),
        bybitPriceUSDT: bybitPrice.toFixed(2),
        exchangeRate: rate.toFixed(2),
        bybitPriceKRW: Math.round(bybitKRW),
        kimchiPremium: kimchiPremium.toFixed(2) + "%"
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: e.message
      })
    };
  }
};
