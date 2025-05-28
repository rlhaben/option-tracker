export async function getData() {
  const ticker = document.getElementById("ticker").value.toUpperCase();
  const res = await fetch(`/api/options?ticker=${ticker}`);
  const data = await res.json();

  if (data.error) {
    document.getElementById("result").innerHTML = `<p>Error: ${data.error}</p>`;
    return;
  }

  const price = data.price;
  const firstCall = data.calls?.[0];

  if (!firstCall) {
    document.getElementById("result").innerHTML = `<p>No call options available.</p>`;
    return;
  }

  const avgPrice = (firstCall.bid + firstCall.ask) / 2;

  document.getElementById("result").innerHTML = `
    <p>Underlying Price: $${price}</p>
    <p>First Call Strike: ${firstCall.strike}</p>
    <p>Bid/Ask: ${firstCall.bid} / ${firstCall.ask}</p>
    <p>Estimated Value: $${avgPrice.toFixed(2)}</p>
  `;
}
