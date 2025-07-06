const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// USD → KRW 환율 가져오기
exports.getExchangeRate = async () => {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD");
    const data = await response.json();
    if (!data.rates || !data.rates.KRW) {
      throw new Error("환율 정보 없음 (fx.rates.KRW)");
    }
    return data; // 전체 환율 객체 반환
  } catch (error) {
    throw new Error("환율 API 실패: " + error.message);
  }
};

// 비트코인 가격 (USD)
exports.getBTCPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    if (!data.bitcoin || !data.bitcoin.usd) {
      throw new Error("Coingecko 응답에 USD 가격 정보 없음");
    }
    return data.bitcoin.usd;
  } catch (error) {
    throw new Error("Coingecko API 실패: " + error.message);
  }
};
