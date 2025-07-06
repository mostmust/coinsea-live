const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    const symbols = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE', 'AVAX', 'MATIC', 'TRX', 'LTC'];

    // CoinGecko ID 매핑
    const coingeckoMap = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      XRP: 'ripple',
      ADA: 'cardano',
      SOL: 'solana',
      DOGE: 'dogecoin',
      AVAX: 'avalanche-2',
      MATIC: 'matic-network',
      TRX: 'tron',
      LTC: 'litecoin'
    };

    // 환율 (USD to KRW)
    const exchangeRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const exchangeJson = await exchangeRes.json();
    const usdToKrw = exchangeJson.rates.KRW;

    const result = {};

    for (const symbol of symbols) {
      try {
        const [upbitRes, cgRes] = await Promise.all([
          fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`),
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoMap[symbol]}&vs_currencies=usd`)
        ]);

        const upbitData = await upbitRes.json();
        const cgData = await cgRes.json();

        const upbit = upbitData[0]?.trade_price || null;
        const binance = cgData[coingeckoMap[symbol]]?.usd || null;
        const binanceKrw = binance ? binance * usdToKrw : null;
        const premium = upbit && binanceKrw ? ((upbit - binanceKrw) / binanceKrw) * 100 : null;

        result[symbol] = {
          upbit,
          binance,
          binanceKrw,
          premium: premium !== null ? Number(premium.toFixed(2)) : null
        };
      } catch (err) {
        result[symbol] = { error: '데이터 로딩 실패', detail: err.message };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        usdToKrw,
        data: result
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '데이터 로딩 실패', detail: error.message })
    };
  }
};
