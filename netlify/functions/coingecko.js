export async function handler() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    const data = await res.json();
    const price = data.bitcoin.usd;

    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Coingecko API 실패", detail: e.message }),
    };
  }
}
