const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
