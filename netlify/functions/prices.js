async function fetchPrices() {
  const priceInfo = {
    btcusd: null,
    usdkrw: null
  };

  try {
    const btcRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/upbitPrice");
    const btcJson = await btcRes.json();
    priceInfo.btcusd = btcJson.price;

    const fxRes = await fetch("https://timely-jalebi-4e5640.netlify.app/.netlify/functions/exchangeRate");
    const fxJson = await fxRes.json();
    priceInfo.usdkrw = fxJson.krw;

    document.getElementById("price-info").innerHTML =
      `BTC/USD 시세: ${priceInfo.btcusd.toLocaleString()} · USD<br>USD/KRW 환율: ${priceInfo.usdkrw.toLocaleString()} · KRW`;
  } catch (err) {
    document.getElementById("price-info").innerHTML =
      "업데이트 실패";
  }

  return priceInfo;
}

async function setupConverter() {
  const { btcusd, usdkrw } = await fetchPrices();

  if (!btcusd || !usdkrw) return;

  const btcInput = document.getElementById("btc");
  const usdInput = document.getElementById("usd");
  const krwInput = document.getElementById("krw");

  function convertFromBTC() {
    const btc = parseFloat(btcInput.value) || 0;
    const usd = btc * btcusd;
    const krw = usd * usdkrw;
    usdInput.value = usd.toFixed(2);
    krwInput.value = Math.round(krw);
  }

  function convertFromUSD() {
    const usd = parseFloat(usdInput.value) || 0;
    const btc = usd / btcusd;
    const krw = usd * usdkrw;
    btcInput.value = btc.toFixed(8);
    krwInput.value = Math.round(krw);
  }

  function convertFromKRW() {
    const krw = parseFloat(krwInput.value) || 0;
    const usd = krw / usdkrw;
    const btc = usd / btcusd;
    usdInput.value = usd.toFixed(2);
    btcInput.value = btc.toFixed(8);
  }

  btcInput.addEventListener("input", convertFromBTC);
  usdInput.addEventListener("input", convertFromUSD);
  krwInput.addEventListener("input", convertFromKRW);
}

window.addEventListener("DOMContentLoaded", setupConverter);
