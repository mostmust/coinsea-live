const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // ✅ 업비트 가격 가져오기 (KRW)
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPriceKRW = upbitData[0]?.trade_price;

    // ✅ 바이낸스 가격 가져오기 (USDT)
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });
    const binanceData = await binanceRes.json();
    const binancePriceUSDT = parseFloat(binanceData.price);

    // ✅ 환율 가져오기 (USD → KRW)
    const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const rateData = await rateRes.json();
    const exchangeRate = rateData.rates.KRW;

    // ✅ 계산: Binance 가격(KRW) = USDT × 환율
    const binancePriceKRW = binancePriceUSDT * exchangeRate;

    // ✅ 김치 프리미엄 계산 (%)
    const kimchiPremium = ((upbitPriceKRW - binancePriceKRW) / binancePriceKRW) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPriceKRW: Math.round(upbitPriceKRW),
        binancePriceUSDT: binancePriceUSDT.toFixed(2),
        exchangeRate: exchangeRate.toFixed(2),
        binancePriceKRW: Math.round(binancePriceKRW),
        kimchiPremium: kimchiPremium.toFixed(2)
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: error.message || "가격 또는 환율 정보를 불러올 수 없습니다"
      })
    };
  }
};
