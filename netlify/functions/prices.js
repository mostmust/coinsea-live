const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await response.json();

    if (data.bitcoin && data.bitcoin.usd) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // ✅ CORS 해결
        },
        body: JSON.stringify({ price: data.bitcoin.usd }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "가격 정보 없음",
          message: "BTC 가격 데이터가 존재하지 않습니다.",
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
