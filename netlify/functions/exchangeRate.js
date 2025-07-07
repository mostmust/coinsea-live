const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await response.json();

    if (!data.rates || data.rates.KRW === undefined) {
      throw new Error("KRW 환율 정보가 존재하지 않습니다.");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ krw: data.rates.KRW })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "업데이트 실패",
        message: error.message
      })
    };
  }
};
