const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data) || !data[0].trade_price) {
      throw new Error("업비트 응답 오류: " + JSON.stringify(data));
    }

    const price = data[0].trade_price;

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
        error: "업비트 API 실패",
        message: err.message,
      }),
    };
  }
};
