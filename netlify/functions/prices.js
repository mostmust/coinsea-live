const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    // 바이낸스 BTC/USDT 가격
    const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const binanceData = await binanceRes.json();
    const btcPriceInUSDT = parseFloat(binanceData.price);

    // exchangerate.host에서 USD → KRW 환율 (access_key 제거됨)
    const fxRes = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const fxData = await fxRes.json();

    if (!fxData.rates || !fxData.rates.KRW) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "환율 정보 없음", message: "KRW 환율 데이터가 존재하지 않습니다." })
      };
    }

    const usdToKrw = fxData.rates.KRW;
    const btcPriceInKRW = btcPriceInUSDT * usdToKrw;

    return {
      statusCode: 200,
      body: JSON.stringify({
        btc: btcPriceInUSDT,
        krw: usdToKrw,
        btc_krw: btcPriceInKRW
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "업데이트 실패", message: error.message })
    };
  }
};
