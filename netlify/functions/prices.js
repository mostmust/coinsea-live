const fetch = require('node-fetch');
const { getBTCPrice } = require('./coingecko');

exports.handler = async () => {
  try {
    const upbitResponse = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitResponse.json();
    const upbitPrice = upbitData[0].trade_price;

    // 환율 API
    const usdToKrwResponse = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const fx = await usdToKrwResponse.json();
    
    if (!fx || !fx.rates || !fx.rates.KRW) {
      throw new Error("환율 정보 없음 (fx.rates.KRW)");
    }

    const usdToKrw = fx.rates.KRW;

    // 바이낸스(코인게코) 가격
    const binancePrice = await getBTCPrice();

    if (!binancePrice) {
      throw new Error("Binance(Coingecko) 가격 정보 없음");
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
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 로딩 실패", detail: error.message }),
    };
  }
};
