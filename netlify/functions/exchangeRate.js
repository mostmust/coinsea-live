const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const data = await res.json();

    if (!data || !data.rates || !data.rates.KRW) {
      throw new Error('환율 정보 없음 (data.rates.KRW)');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        usdToKrw: data.rates.KRW,
        date: data.date,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '환율 데이터 로딩 실패',
        detail: error.message,
      }),
    };
  }
};
