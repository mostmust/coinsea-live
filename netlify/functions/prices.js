const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { getExchangeRate, getBTCPrice } = require("./coingecko");

exports.handler = async function () {
  try {
    // 1. 업비트 가격
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData[0]?.trade_price;
    if (!upbitPrice) {
      throw new Error("업비트 가격 정보 없음");
    }

    // 2. 환율
    const fx = await getExchangeRate();
    const usdToKrw = fx.rates.KRW;

    // 3. 바이낸스(코인게코) 가격
    const binancePrice = await getBTCPrice();
    const binancePriceInKrw = binancePrice * usdToKrw;

    // 4. 김프 계산
    const premium = ((upbitPrice - binancePriceInKrw) / binancePriceInKrw) * 100;

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPrice,
        binancePrice,
        usdToKrw,
        binancePriceInKrw,
        premium: premium.toFixed(2)
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 로딩 실패", detail: err.message }),
    };
  }
};
