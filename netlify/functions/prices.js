const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const res = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const data = await res.json();

    if (data.krw) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          usd: 1,
          krw: data.krw,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "환율 없음",
          message: "KRW 환율을 가져오지 못했습니다.",
          raw: data,
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "서버 오류",
        message: error.message,
      }),
    };
  }
};
