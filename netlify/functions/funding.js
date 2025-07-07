const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const res = await fetch("https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT");
    const data = await res.json();
    const fundingRate = parseFloat(data.lastFundingRate) * 100; // %로 변환

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ fundingRate: fundingRate.toFixed(4) })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "펀딩비 정보를 불러올 수 없습니다." })
    };
  }
};
