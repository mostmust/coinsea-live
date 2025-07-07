const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. 업비트 BTC/KRW 시세 가져오기
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || !data[0].trade_price) {
      throw new Error("업비트 응답 오류: " + JSON.stringify(data));
    }

    const krwPrice = data[0].trade_price;

    // 2. 환율 API (USD to KRW) 가져오기
    const exchangeRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const exchangeData = await exchangeRes.json();

    const usdToKrw = exchangeData?.rates?.KRW;

    if (!usdToKrw) {
      throw new Error("환율 정보 없음");
    }

    // 3. KRW → USD 환산
    const price = krwPrice / usdToKrw;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ price }),  // ✅ 달러 기준 BTC 가격
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "시세 불러오기 실패",
        message: err.message,
      }),
    };
  }
};
