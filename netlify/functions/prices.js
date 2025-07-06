const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    // 환율 API
    const fxRes = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const fx = await fxRes.json();
    const usdToKrw = fx.rates?.KRW;

    if (!usdToKrw) throw new Error("환율 정보 없음 (fx.rates.KRW)");

    // 코인게코에서 BTC 가격(USD 기준)
    const cgRes = await fetch(`${process.env.URL}/.netlify/functions/coingecko`);
    const cgData = await cgRes.json();

    const binancePrice = cgData.price;
    const upbitPrice = 147787000; // 임시 고정값

    if (!binancePrice || !upbitPrice) {
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
        binancePriceInKrw,
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
