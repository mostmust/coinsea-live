const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const symbolList = ['BTC', 'ETH', 'XRP', 'ADA', 'DOGE', 'SOL', 'AVAX', 'MATIC', 'TRX', 'LTC'];

exports.handler = async () => {
  try {
    const markets = symbolList.map(sym => `KRW-${sym}`).join(',');
    const res = await fetch(`https://api.upbit.com/v1/ticker?markets=${markets}`);
    const json = await res.json();

    if (!Array.isArray(json)) {
      throw new Error('Upbit 응답 형식 오류');
    }

    const map = {};
    json.forEach(item => {
      const symbol = item.market.replace('KRW-', '');
      map[symbol] = item.trade_price;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(map),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '업비트 데이터 로딩 실패',
        detail: error.message,
      }),
    };
  }
};
