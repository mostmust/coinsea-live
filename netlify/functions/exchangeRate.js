const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const json = await res.json();
    const rate = json.rates?.KRW;

    if (!rate) {
      throw new Error("환율 정보 없음 (rates.KRW)");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ usdToKrw: rate }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "환율 로딩 실패", detail: err.message }),
    };
  }
};
