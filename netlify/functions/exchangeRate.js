const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const url = "https://api.exchangerate.host/latest?base=USD&symbols=KRW";
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.rates && data.rates.KRW) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ krw: data.rates.KRW }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "환율 정보 없음",
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
