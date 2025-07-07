import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KRW");
    const data = await response.json();
    const krw = data.rates.KRW;

    return res.status(200).json({
      krw,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("환율 API 오류:", error);
    return res.status(500).json({
      error: "업데이트 실패",
      message: error.message
    });
  }
}
