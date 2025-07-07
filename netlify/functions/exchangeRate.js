const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await response.json();

    const rate = data?.rates?.KRW;

    if (!rate) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "환율 정보를 가져오지 못했습니다.",
          data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS 허용
      },
      body: JSON.stringify({
        krw: rate,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "서버 오류 발생",
        message: err.message,
      }),
    };
  }
};
