const fetch = require("node-fetch");

const ACCESS_KEY = "d900b09afec85ec2f5f506a607dbb958";

exports.handler = async function () {
  try {
    const url = `https://api.exchangerate.host/latest?base=USD&symbols=KRW&access_key=${ACCESS_KEY}`;
    const response = await fetch(url);
    const json = await response.json();

    if (!json || !json.rates || typeof json.rates.KRW !== "number") {
      throw new Error("KRW 환율 정보가 존재하지 않습니다.");
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ krw: json.rates.KRW })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "업데이트 실패",
        message: error.message
      })
    };
  }
};
