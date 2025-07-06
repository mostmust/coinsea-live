const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  const { symbol } = event.queryStringParameters;

  try {
    const res = await fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        price: data[0].trade_price,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Upbit API 호출 실패",
        detail: error.message,
      }),
    };
  }
};
