const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const symbols = ["BTC", "ETH", "XRP", "ADA", "SOL", "DOGE", "AVAX", "MATIC", "TRX", "LTC"];
    const prices = {};

    // 환율 가져오기
    const rateRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const rateData = await rateRes.json();
    const usdToKrw = rateData.usdToKrw;

    for (let symbol of symbols) {
      try {
        // 업비트 가격
        const upbitRes = await fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`);
        const upbitJson = await upbitRes.json();
        const upbitPrice = upbitJson[0]?.trade_price;

        // 바이낸스 가격
        const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
        
        if (!binanceRes.ok) {
          throw new Error(`Binance API Error for ${symbol}: ${binanceRes.status}`);
        }

        const binanceJson = await binanceRes.json();
        console.log(`✅ Binance ${symbol} →`, binanceJson); // ✅ 로그 확인용
        
        const binancePrice = parseFloat(binanceJson.price);
        const binancePriceKrw = binancePrice * usdToKrw;
        const kimchiPremium = ((upbitPrice - binancePriceKrw) / binancePriceKrw) * 100;

        prices[symbol] = {
          upbit: upbitPrice,
          binance: binancePrice,
          binanceKrw: binancePriceKrw,
          premium: kimchiPremium,
        };
      } catch (innerErr) {
        console.error(`❌ ${symbol} 오류:`, innerErr.message);
        prices[symbol] = { error: "데이터 로딩 실패" };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        usdToKrw,
        data: prices,
      }),
    };
  } catch (err) {
    console.error("🔥 전체 오류:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "데이터 로딩 실패",
        detail: err.message,
      }),
    };
  }
};
