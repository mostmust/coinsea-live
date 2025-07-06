exports.handler = async () => {
  try {
    const [upbitRes, binanceRes, fxRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"),
      fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW")
    ]);

    const upbit = await upbitRes.json();
    const binance = await binanceRes.json();
    let fx = await fxRes.json();

    // Backup 환율 API 사용 (if fx.rates.KRW가 없을 경우)
    if (!fx || !fx.rates || !fx.rates.KRW) {
      const backupFxRes = await fetch("https://open.er-api.com/v6/latest/USD");
      const backupFx = await backupFxRes.json();
      fx.rates = { KRW: backupFx.rates.KRW };
    }

    const upbitPrice = upbit[0].trade_price;
    const binancePrice = parseFloat(binance.price);
    const usdToKrw = fx.rates.KRW;

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
