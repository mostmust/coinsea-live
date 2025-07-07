const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const API_KEY = "d900b09afec85ec2f5f506a607dbb958";
    const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=KRW&source=USD&format=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.quotes && data.quotes.USDKRW) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // ✅ CORS 해결
        },
        body: JSON.stringify({ krw: data.quotes.USDKRW }),
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "환율 정보 없음",
          message: "KRW 환율 데이터가 존재하지 않습니다.",
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
