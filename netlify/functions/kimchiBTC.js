const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 업비트 가격 (KRW)
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData[0]?.trade_price;

    // 바이낸스 가격 (USDT)
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const binanceData = await binanceRes.json();
    const binancePrice = parseFloat(binanceData?.price);

    // 환율 (USD -> KRW)
    const API_KEY = "d900b09afec85ec2f5f506a607dbb958"; // 사용자 제공 키
    const exchangeRes = await fetch(`https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=KRW&source=USD&format=1`);
    const exchangeData = await exchangeRes.json();
    const exchangeRate = exchangeData?.quotes?.USDKRW;

    if (!upbitPrice || !binancePrice || !exchangeRate) {
      throw new Error("가격 또는 환율 정보를 불러올 수 없습니다");
    }

    // 김치 프리미엄 계산
    const convertedBinancePrice = binancePrice * exchangeRate;
    const kimchiPremium = ((upbitPrice - convertedBinancePrice) / convertedBinancePrice) * 100;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        upbitPrice,
        binancePrice,
        exchangeRate,
        kimchiPremium: kimchiPremium.toFixed(2)
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Data fetch failed", detail: err.message })
    };
  }
};
