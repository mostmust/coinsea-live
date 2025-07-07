const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await res.json();

    console.log("API 응답 전체:", data); // ✅ 디버깅 로그

    const rate = data?.rates?.KRW;

    if (!rate) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "환율 정보 없음",
          message: "KRW 환율 데이터가 존재하지 않습니다.",
          raw: data // ← 원본 응답 같이 보내기 (디버깅용)
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
