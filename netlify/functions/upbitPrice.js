const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 BTC/KRW 시세 가져오기
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const data = await res.json();

    if (!data || !data[0]?.trade_price) {
      throw new Error("업비트 응답 오류");
    }

    const krwPrice = data[0].trade_price;

    // 2. 환율 가져오기 (USD to KRW)
    const fxRes = await fetch("https://api.exchangerate.host/live?access_key=d900b09afec85ec2f5f506a607dbb958&currencies=KRW&source=USD&format=1");
    const fxData = await fxRes.json();

    if (!fxData?.result) {
      throw new Error("환율 정보 오류");
    }

    const usdToKrw = fxData.result;

    // 3. USD 가격 계산
    const price = krwPrice / usdToKrw;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ price }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "데이터 로딩 실패",
        message: err.message,
      }),
    };
  }
};
