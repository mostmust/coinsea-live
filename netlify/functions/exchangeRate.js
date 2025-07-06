const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();

    if (!data || !data.rates || !data.rates.KRW) {
      throw new Error("환율 정보 없음 (data.rates.KRW)");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        usdToKrw: data.rates.KRW,
        date: data.time_last_update_utc
      }),
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
