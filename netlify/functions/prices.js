const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  const symbols = ["BTC", "ETH", "XRP", "ADA", "DOGE", "SOL", "AVAX", "MATIC", "TRX", "LTC"];
  const coinGeckoMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    SOL: "solana",
    AVAX: "avalanche-2",
    MATIC: "polygon",
    TRX: "tron",
    LTC: "litecoin",
  };

  try {
    // 1. 환율
    const exchangeRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const exchangeData = await exchangeRes.json();
    const usdToKrw = exchangeData.usdToKrw || 1360;

    // 2. 업비트 가격
    const upbitTickers = symbols.map((s) => `${s}-KRW`).join(",");
    const upbitRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${upbitTickers}`);
    const upbitData = await upbitRes.json();
    const upbitMap = {};
    upbitData.forEach((item) => {
      const symbol = item.market.split("-")[0];
      upbitMap[symbol] = item.trade_price;
    });

    // 3. CoinGecko 가격 (USD)
    const geckoQuery = Object.values(coinGeckoMap).join(",");
    const geckoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoQuery}&vs_currencies=usd`);
    const geckoData = await geckoRes.json();

    // 4. 최종 데이터 정리
    const result = {};
    symbols.forEach((symbol) => {
      try {
        const upbit = upbitMap[symbol] ?? null;
        const geckoId = coinGeckoMap[symbol];
        const binance = geckoData[geckoId]?.usd ?? null;
        const binanceKrw = binance ? binance * usdToKrw : null;
        const premium = upbit && binanceKrw ? (((upbit - binanceKrw) / binanceKrw) * 100).toFixed(2) : null;

        result[symbol] = {
          upbit,
          binance,
          binanceKrw: binanceKrw ? Math.round(binanceKrw) : null,
          premium: premium ? Number(premium) : null,
        };
      } catch (err) {
        result[symbol] = {
          error: "데이터 로딩 실패",
          detail: err.message,
        };
      }
    });

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
        error: "전체 데이터 처리 실패",
        detail: error.message,
      }),
    };
  }
};
