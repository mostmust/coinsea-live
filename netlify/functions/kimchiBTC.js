const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const [upbitRes, binanceRes, fxRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
      fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW")
    ]);

    const upbitData = await upbitRes.json();
    const binanceData = await binanceRes.json();
    const fxData = await fxRes.json();

    // ⚠️ 응답 검증
    if (!Array.isArray(upbitData) || !upbitData[0]?.trade_price) {
      throw new Error("Invalid Upbit response: " + JSON.stringify(upbitData));
    }
    if (!binanceData?.price) {
      throw new Error("Invalid Binance response: " + JSON.stringify(binanceData));
    }
    if (!fxData?.rates?.KRW) {
      throw new Error("Invalid FX response: " + JSON.stringify(fxData));
    }

    const upbitPrice = upbitData[0].trade_price;
    const binancePrice = parseFloat(binanceData.price);
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
    console.error("❌ API 처리 중 에러:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: err.message
      })
    };
  }
};
