const fetch = require("node-fetch");

exports.handler = async function () {
  try {
    const API_KEY = "d900b09afec85ec2f5f506a607dbb958";
    const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&currencies=KRW&source=USD&format=1`;

    const fxRes = await fetch(url);
    const fxData = await fxRes.json();

    if (!fxData.success || !fxData.quotes || !fxData.quotes.USDKRW) {
      throw new Error("환율(KRW) 데이터를 가져오지 못했습니다");
    }

    const krwRate = fxData.quotes.USDKRW;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ krwRate })
    };
  } catch (err) {
    console.error("환율 요청 실패:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Data fetch failed",
        detail: err.message
      })
    };
  }
};
