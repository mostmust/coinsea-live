const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  const coinGeckoIds = {
    BTC: "bitcoin",
    ETH: "ethereum",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    SOL: "solana",
    AVAX: "avalanche-2",
    MATIC: "polygon",
    TRX: "tron",
    LTC: "litecoin"
  };

  const symbols = Object.keys(coinGeckoIds);
  const query = symbols.map(sym => coinGeckoIds[sym]).join(',');

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=usd`);
    const data = await res.json();

    const result = {};

    for (const symbol of symbols) {
      const id = coinGeckoIds[symbol];
      const usd = data[id]?.usd;

      if (usd === undefined) {
        result[symbol] = {
          error: "데이터 로딩 실패",
          detail: "가격 정보 없음",
        };
      } else {
        result[symbol] = {
          usd: usd,
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "CoinGecko API 실패",
        detail: error.message,
      }),
    };
  }
};
