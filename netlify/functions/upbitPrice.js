const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 BTC/KRW 시세
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const data = await res.json();
    const krwPrice = data?.[0]?.trade_price;

    // 2. 무료 환율 API (USD→KRW)
    const fxRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const fxData = await fxRes.json();
    const usdToKrw = fxData?.rates?.KRW;

    if (krwPrice && usdToKrw) {
      const usdPrice = krwPrice / usdToKrw;

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ price: usdPrice }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "시세 또는 환율 정보 부족",
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
        error: "서버 오류",
        message: err.message,
      }),
    };
  }
};
