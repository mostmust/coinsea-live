const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // ✅ 업비트 시세 (KRW)
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPriceKRW = upbitData[0]?.trade_price;

    // ✅ 바이비트 시세 (USDT)
    const bybitRes = await fetch("https://api.bybit.com/v2/public/tickers?symbol=BTCUSDT");
    const bybitData = await bybitRes.json();

    const bybitPriceUSDT = parseFloat(bybitData?.result?.[0]?.last_price);

    if (!bybitPriceUSDT || isNaN(bybitPriceUSDT)) {
      throw new Error("Bybit 시세를 불러오지 못했습니다.");
    }

    // ✅ 환율 (USD → KRW)
    const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const rateData = await rateRes.json();
    const exchangeRate = rateData.rates.KRW;

    if (!exchangeRate || isNaN(exchangeRate)) {
      throw new Error("환율 데이터를 불러오지 못했습니다.");
    }

    // ✅ 계산
    const bybitPriceKRW = bybitPriceUSDT * exchangeRate;
    const kimchiPremium = ((upbitPriceKRW - bybitPriceKRW) / bybitPriceKRW) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPriceKRW: Math.round(upbitPriceKRW),
        bybitPriceUSDT: bybitPriceUSDT.toFixed(2),
        exchangeRate: exchangeRate.toFixed(2),
        bybitPriceKRW: Math.round(bybitPriceKRW),
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
