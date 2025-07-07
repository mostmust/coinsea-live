const fetch = require('node-fetch');

exports.handler = async function () {
  try {
    const [upbitRes, binanceRes, fxRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
      fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW")
    ]);

    console.log("✅ API 요청 완료");

    const upbitData = await upbitRes.json();
    const binanceData = await binanceRes.json();
    const fxData = await fxRes.json();

    console.log("🔄 API 응답 파싱 완료", { upbitData, binanceData, fxData });

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
        kimchiPremium: kimchiPremium.toFixed(2),
      })
    };
  } catch (err) {
    console.error("❌ 에러 발생:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: err.message
      })
    };
  }
};
