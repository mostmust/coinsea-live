const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].trade_price) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // ✅ CORS 해결
        },
        body: JSON.stringify({ price: data[0].trade_price }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "업비트 데이터 없음",
          message: "KRW-BTC 시세 데이터가 존재하지 않습니다.",
          raw: data,
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
