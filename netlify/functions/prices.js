const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    // 1. 업비트 가격 가져오기
    const upbitRes = await fetch(`${process.env.URL}/.netlify/functions/upbitPrice`);
    const upbitData = await upbitRes.json();

    // 2. 바이낸스(CoinGecko) USD 가격 가져오기
    const binanceRes = await fetch(`${process.env.URL}/.netlify/functions/coingecko`);
    const binanceData = await binanceRes.json();

    // 3. 환율 가져오기
    const rateRes = await fetch(`${process.env.URL}/.netlify/functions/exchangeRate`);
    const rateData = await rateRes.json();
    const usdToKrw = rateData.usdToKrw;

    // 4. 전체 시세 + 프리미엄 계산
    const result = {};
    const symbols = ['BTC', 'ETH', 'XRP', 'ADA', 'DOGE', 'SOL', 'AVAX', 'MATIC', 'TRX', 'LTC'];

    for (const symbol of symbols) {
      try {
        const upbit = upbitData[symbol];
        const binance = binanceData[symbol];
        const binanceKrw = binance !== null ? binance * usdToKrw : null;
        const premium = upbit && binanceKrw ? (((upbit - binanceKrw) / binanceKrw) * 100).toFixed(2) : null;

        result[symbol] = { upbit, binance, binanceKrw, premium };
      } catch (err) {
        result[symbol] = {
          error: '데이터 로딩 실패',
          detail: err.message,
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        usdToKrw,
        data: result,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '전체 데이터 처리 실패',
        detail: error.message,
      }),
    };
  }
};
