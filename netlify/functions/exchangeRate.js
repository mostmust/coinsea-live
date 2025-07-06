exports.handler = async () => {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const fx = await res.json();

    console.log("🔍 API 응답 내용:", fx); // 이 줄 추가
    if (!fx.rates || !fx.rates.KRW) {
      throw new Error("환율 정보 없음 (fx.rates.KRW)");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ usdToKrw: fx.rates.KRW }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "데이터 로딩 실패",
        detail: error.message,
      }),
    };
  }
};
