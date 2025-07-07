const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const ACCESS_KEY = "d900b09afec85ec2f5f506a607dbb958"; // ← 꼭 필요!
    const url = `https://api.exchangerate.host/latest?base=USD&symbols=KRW&access_key=${ACCESS_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const rate = data?.rates?.KRW;

    if (!rate) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "환율 정보 없음",
          message: "KRW 환율 데이터가 존재하지 않습니다.",
          raw: data // ✅ 원본 응답 확인용
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        base: "USD",
        target: "KRW",
        rate
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API 호출 실패",
        message: err.message
      })
    };
  }
};
