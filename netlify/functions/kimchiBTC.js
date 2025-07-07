const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // ✅ 업비트 BTC/KRW
    const upbitRes = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
    const upbitData = await upbitRes.json();
    const upbitPrice = upbitData[0]?.trade_price;
    if (!upbitPrice) throw new Error("업비트 가격을 가져오지 못했습니다");

    // ✅ 코인게코 BTC/USD
    const cgRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const cgData = await cgRes.json();
    const binancePrice = cgData.bitcoin?.usd;
    if (!binancePrice) throw new Error("코인게코 가격을 가져오지 못했습니다");

    // ✅ 환율 (USD → KRW)
    const fxRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const fxData = await fxRes.json();
    const krwRate = fxData?.rates?.KRW;
    if (!krwRate) throw new Error("환율(KRW) 데이터를 가져오지 못했습니다");

    // ✅ 김치프리미엄 계산
    const globalPriceKRW = binancePrice * krwRate;
    const kimchiPremium = ((upbitPrice - globalPriceKRW) / globalPriceKRW) * 100;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        upbitPrice,
        binancePrice,
        krwRate,
        kimchiPremium: kimchiPremium.toFixed(2)
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: err.message
      })
    };
  }
};
