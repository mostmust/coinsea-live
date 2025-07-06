export async function handler() {
  try {
    // 업비트 가격 가져오기
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData[0].trade_price;

    // 환율 가져오기
    const fxRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const fx = await fxRes.json();
    const usdToKrw = fx.rates.KRW;

    // 코인게코 가격 가져오기
    const coingeckoRes = await fetch(`${process.env.URL}/.netlify/functions/coingecko`);
    const coingeckoData = await coingeckoRes.json();
    const usdPrice = coingeckoData.price;

    if (!upbitPrice || !usdToKrw || !usdPrice) {
      throw new Error("가격 데이터 누락");
    }

    // 김프 계산
    const binancePriceInKrw = usdPrice * usdToKrw;
    const premium = (((upbitPrice - binancePriceInKrw) / binancePriceInKrw) * 100).toFixed(2);

    return {
      statusCode: 200,
      body: JSON.stringify({
        upbitPrice: Math.round(upbitPrice),
        usdPrice,
        usdToKrw,
        binancePriceInKrw: Math.round(binancePriceInKrw),
        premium: premium + "%",
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 로딩 실패", detail: e.message }),
    };
  }
}
