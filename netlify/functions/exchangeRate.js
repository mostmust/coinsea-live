import fetch from 'node-fetch';

const handler = async (event, context) => {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await response.json();
    const krw = data.rates.KRW;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ krw })
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
};

export { handler };
