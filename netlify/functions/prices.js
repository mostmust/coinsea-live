const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 1. BTC → USD (CoinGecko)
    const cgUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
    const cgRes = await fetch(cgUrl);
    const cgData = await cgRes.json();

    const btcUsd = cgData?.bitcoin?.usd;

    if (!btcUsd) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "BTC 시세 정보 없음",
          message: "CoinGecko에서 BTC 시세를 가져올 수 없습니다.",
          raw: cgData
        })
      };
    }

    // 2. USD → KRW (exchangerate.host)
    const ACCESS_KEY = "d900b09afec85ec2f5f506a607dbb958";
    const fxUrl = `https://api.exchangerate.host/latest?base=USD&symbols=KRW&access_key=${ACCESS_KEY}`;
    const fxRes = await fetch(fxUrl);
    const fxData = await fxRes.json();

    const usdKrw = fxData?.rates?.KRW;

    if (!usdKrw) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "환율 정보 없음",
          message: "KRW 환율 데이터가 존재하지 않습니다.",
          raw: fxData
        })
      };
    }

    // 3. BTC → KRW 계산
    const btcKrw = btcUsd * usdKrw;

    return {
      statusCode: 200,
      body: JSON.stringify({
        price: {
          BTC_USD: btcUsd,
          USD_KRW: usdKrw,
          BTC_KRW: btcKrw
        }
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API 처리 중 오류 발생",
        message: err.message
      })
    };
  }
};
