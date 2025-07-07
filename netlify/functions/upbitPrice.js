const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 업비트에서 BTC/KRW 시세 가져오기
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const data = await response.json();

    // 환율 가져오기 (USD → KRW)
    const exchangeRes = await fetch("https://api.exchangerate.host/live?access_key=d900b09afec85ec2f5f506a607dbb958&currencies=KRW&source=USD&format=1");
    const exchangeData = await exchangeRes.json();

    const krwPrice = data?.[0]?.trade_price;
    const usdToKrw = exchangeData?.quotes?.USDKRW;

    if (krwPrice && usdToKrw) {
      const usdPrice = krwPrice / usdToKrw;

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // ✅ CORS 허용
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
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "서버 오류",
        message: error.message,
      }),
    };
  }
};
