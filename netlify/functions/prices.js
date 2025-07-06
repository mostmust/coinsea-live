const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event) {
  try {
    const symbols = ["BTC", "ETH", "XRP", "ADA", "SOL", "DOGE", "AVAX", "MATIC", "TRX", "LTC"];
    const prices = {};

    // 🔧 환율 호출 - fetch 사용 (오타 수정됨)
    const rateRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const rateData = await rateRes.json();
    const usdToKrw = rateData.usdToKrw;

// 기존 코드 일부 수정
for (let symbol of symbols) {
  try {
    // 업비트 가격 요청
    const upbitRes = await fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`);
    const upbitJson = await upbitRes.json();
    const upbitPrice = upbitJson[0].trade_price;

    // 바이낸스 가격 요청 + 디버깅용 로그
    const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const binanceText = await binanceRes.text(); // 바이낸스 응답 원본(텍스트)
    console.log(`Binance 응답(${symbol}):`, binanceText); // ✅ 로그 출력

    // 실제 응답이 JSON이라면 파싱
    const binanceJson = JSON.parse(binanceText);
    const binancePrice = parseFloat(binanceJson.price);

    // 김프 계산
    const binancePriceKrw = binancePrice * usdToKrw;
    const kimchiPremium = ((upbitPrice - binancePriceKrw) / binancePriceKrw) * 100;

    prices[symbol] = {
      upbit: upbitPrice,
      binance: binancePrice,
      binanceKrw: binancePriceKrw,
      premium: kimchiPremium,
    };
  } catch (innerErr) {
    console.error(`❌ ${symbol} 처리 중 오류:`, innerErr.message); // ✅ 에러 로그도 추가
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "데이터 로딩 실패",
        detail: err.message,
      }),
    };
  }
};
