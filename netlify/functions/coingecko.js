const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    if (!data.bitcoin || !data.bitcoin.usd) {
      throw new Error("Coingecko 응답에 USD 가격 정보 없음");
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ price: data.bitcoin.usd })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Coingecko API 실패", detail: error.message })
    };
  }
};
