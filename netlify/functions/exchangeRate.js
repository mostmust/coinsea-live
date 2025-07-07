const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const API_KEY = "d900b09afec85ec2f5f506a607dbb958";
    const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=KRW&source=USD&format=1`;
    const response = await fetch(url);
    const data = await response.json();
    const rate = data?.quotes?.USDKRW;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ rate })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "환율(KRW) 데이터를 가져오지 못했습니다" })
    };
  }
};
