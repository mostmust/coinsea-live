export async function handler(event, context) {
  try {
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=USDT-BTC");

    if (!response.ok) {
      throw new Error(`HTTP 상태 오류: ${response.status}`);
    }

    const data = await response.json();
    const price = data[0].trade_price;

    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "업데이트 실패",
        message: error.message
      })
    };
  }
}
