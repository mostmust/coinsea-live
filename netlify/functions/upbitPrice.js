const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트에서 원화 BTC 시세 가져오기
    const upbitResponse = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitResponse.json();
    const priceKRW = upbitData[0]?.trade_price;

    // 2. exchangerate.host에서 USD/KRW 환율 가져오기
    const exchangeResponse = await fetch("https://api.exchangerate.host/live?access_key=d900b09afec85ec2f5f506a607dbb958&currencies=KRW&source=USD&format=1");
    const exchangeData = await exchangeResponse.json();
    const usdToKrw = exchangeData?.quotes?.USDKRW;

    if (!priceKRW || !usdToKrw) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "데이터 부족" }),
      };
    }

    const priceUSD = priceKRW / usdToKrw;

    return {
      statusCode: 200,
      body: JSON.stringify({ price: priceUSD }), // ✅ 이제 달러 기준
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
