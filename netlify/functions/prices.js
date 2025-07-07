async function fetchExchangeRate() {
  try {
    const response = await fetch("/.netlify/functions/exchangeRate");
    const data = await response.json();

    if (data.krw) {
      return data.krw;
    } else {
      console.error("환율 정보를 가져오지 못했습니다.", data);
      return null;
    }
  } catch (error) {
    console.error("환율 요청 중 오류 발생:", error);
    return null;
  }
}

// 사용 예시
fetchExchangeRate().then(rate => {
  if (rate !== null) {
    const usd = 1;
    const krw = usd * rate;
    document.getElementById("exchangeRateDisplay").textContent =
      `1 USD ≒ ${krw.toLocaleString()} KRW`;
  } else {
    document.getElementById("exchangeRateDisplay").textContent =
      "환율 정보를 불러올 수 없습니다.";
  }
});
