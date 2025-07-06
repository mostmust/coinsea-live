exports.handler = async () => {
  try {
    const [upbitRes, binanceRes, fxRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
      fetch("https://open.er-api.com/v6/latest/USD")
    ]);

    const upbit = await upbitRes.json();
    const binance = await binanceRes.json();
    const fx = await fxRes.json();

    const upbitPrice = upbit[0]?.trade_price;
    const binancePrice = binance?.price ? parseFloat(binance.price) : null;
    const usdToKrw = fx?.conversion_rates?.KRW;

    if (!binancePrice || !usdToKrw || !upbitPrice) {
      throw new Error("가격 데이터 누락");
    }

    const binancePriceInKrw = binancePrice * usdToKrw;
    const premium = ((upbitPrice - binancePriceInKrw) / binancePriceInKrw) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPrice,
        binancePrice,
        usdToKrw,
        binancePriceInKrw: Math.round(binancePriceInKrw),
        premium: premium.toFixed(2)
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 로딩 실패", detail: e.message })
    };
  }
};
