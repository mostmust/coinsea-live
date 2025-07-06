const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const coinGeckoIds = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  SOL: "solana",
  AVAX: "avalanche-2",
  MATIC: "matic-network",
  TRX: "tron",
  LTC: "litecoin"
};

exports.handler = async function (event) {
  try {
    const symbols = Object.keys(coinGeckoIds);
    const prices = {};

    // ✅ 환율 API 호출
    const rateRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const rateData = await rateRes.json();
    const usdToKrw = rateData.usdToKrw;

    for (let symbol of symbols) {
      try {
        // ✅ 업비트 가격
        const upbitRes = await fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`);
        const upbitJson = await upbitRes.json();
        const upbitPrice = upbitJson[0]?.trade_price;

        // ✅ CoinGecko 가격
        const id = coinGeckoIds[symbol];
        const geckoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
        const geckoJson = await geckoRes.json();
        const binancePrice = geckoJson[id]?.usd;

        if (!upbitPrice || !binancePrice) throw new Error("가격 정보 없음");

        const binanceKrw = binancePrice * usdToKrw;
        const premium = ((upbitPrice - binanceKrw) / binanceKrw) * 100;

        prices[symbol] = {
          upbit: upbitPrice,
          binance: binancePrice,
          binanceKrw: parseFloat(binanceKrw.toFixed(2)),
          premium: parseFloat(premium.toFixed(2))
        };
      } catch (err) {
        prices[symbol] = {
          error: "데이터 로딩 실패",
          detail: err.message
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        usdToKrw,
        data: prices
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "전체 처리 실패",
        detail: err.message
      })
    };
  }
};
