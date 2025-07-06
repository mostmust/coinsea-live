const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const coingeckoMap = {
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  SOL: 'solana',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  TRX: 'tron',
  LTC: 'litecoin',
};

exports.handler = async () => {
  try {
    const ids = Object.values(coingeckoMap).join(',');
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const json = await res.json();

    const result = {};
    for (const [symbol, id] of Object.entries(coingeckoMap)) {
      result[symbol] = json[id]?.usd || null;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'CoinGecko 데이터 로딩 실패',
        detail: error.message,
      }),
    };
  }
};
