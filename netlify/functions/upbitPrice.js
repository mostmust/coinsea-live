export async function handler(event, context) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch("https://api.upbit.com/v1/ticker?markets=USDT-BTC");
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
    console.error("업비트 시세 호출 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "업데이트 실패" })
    };
  }
}
