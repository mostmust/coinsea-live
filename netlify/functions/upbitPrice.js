const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=USDT-BTC");
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ price: data[0].trade_price })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "업비트 시세를 불러오지 못했습니다." })
    };
  }
};
