const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    // 환율 가져오기
    const fxRes = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const fx = await fxRes.json();
    const usdToKrw = fx.rates?.KRW;
    if (!usdToKrw) throw new Error("환율 정보 없음 (fx.rates.KRW)");

    // Coingecko에서 BTC 가격 가져오기
    const cgRes = await fetch('https://timely-jalebi-4e5640.netlify.app/.netlify/functions/coingecko');
    const cgData = await cgRes.json();
    const binancePrice = cgData.price;
    const upbitPrice = 147787000; // 예시 고정값

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
