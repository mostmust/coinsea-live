const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await response.json();

    const rate = data?.rates?.KRW;

    if (!rate) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "환율 정보 없음",
          message: "KRW 환율 데이터가 존재하지 않습니다."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        base: "USD",
        target: "KRW",
        rate: rate
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "업데이트 실패",
        message: err.message
      })
    };
  }
};
