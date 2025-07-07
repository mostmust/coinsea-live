const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const API_KEY = "d900b09afec85ec2f5f506a607dbb958";
    const url = `https://api.exchangerate.host/latest?base=USD&symbols=KRW&access_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.rates && data.rates.KRW) {
      return {
        statusCode: 200,
        body: JSON.stringify({ krw: data.rates.KRW }),
      };
    } else {
      return {
        statusCode: 500,
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
      body: JSON.stringify({
        error: "서버 오류",
        message: error.message,
      }),
    };
  }
};
