const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const coingecko = require('./coingecko');

exports.handler = async () => {
  try {
    // 1. 업비트 가격
    const upbitRes = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData?.[0]?.trade_price;
    if (!upbitPrice) throw new Error("업비트 가격 데이터 없음");

    // 2. Coingecko 가격 (USD)
    const binancePrice = await coingecko.getBTCPrice();
    if (!binancePrice) throw new Error("Binance 가격 데이터 없음");

    // 3. 환율 USD → KRW
    const fxRes = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const fx = await fxRes.json();
    const usdToKrw = fx?.rates?.KRW;
    if (!usdToKrw) throw new Error("환율 정보 없음 (fx.rates.KRW)");

    // 4. 계산
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "데이터 로딩 실패",
        detail: error.message
      })
    };
  }
};
