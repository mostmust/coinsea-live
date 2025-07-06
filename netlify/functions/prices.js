const { getBTCPrice } = require("./coingecko");
const { getExchangeRate } = require("./exchangeRate");

exports.handler = async () => {
  try {
    const upbitPrice = 147000000; // 예시로 고정. 실제로는 업비트 API 연동 필요
    const binancePrice = await getBTCPrice();
    const usdToKrw = await getExchangeRate();

    if (!binancePrice || !usdToKrw) {
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
        premium: premium.toFixed(2),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "데이터 로딩 실패", detail: error.message }),
    };
  }
};
