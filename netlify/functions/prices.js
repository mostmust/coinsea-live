const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 BTC/KRW 가격
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const krwPrice = upbitData?.[0]?.trade_price;

    // 2. 환율 API (무료 endpoint)
    const exchangeRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const exchangeData = await exchangeRes.json();
    const usdToKrw = exchangeData?.rates?.KRW;

    // 3. 계산
    if (krwPrice && usdToKrw) {
      const btcToUsd = krwPrice / usdToKrw;

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          btc_krw: krwPrice,
          usd_krw: usdToKrw,
          btc_usd: btcToUsd,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "시세 또는 환율 데이터 누락",
          krwPrice,
          usdToKrw,
        }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "API 처리 오류",
        message: err.message,
      }),
    };
  }
};
