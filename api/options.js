export default async function handler(req, res) {
  const { ticker } = req.query;
  console.log("Received ticker:", ticker);

  if (!ticker) {
    return res.status(400).json({ error: "Missing ticker" });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/options/${ticker}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Yahoo response error:", response.status);
      return res.status(502).json({ error: "Failed to fetch Yahoo Finance data" });
    }

    const data = await response.json();
    console.log("Yahoo data:", JSON.stringify(data).slice(0, 500)); // trim to avoid flood

    const result = data?.optionChain?.result?.[0];
    if (!result || !result.options || result.options.length === 0) {
      return res.status(404).json({ error: "No option data found for this ticker" });
    }

    const quote = result.quote;
    const options = result.options[0];

    return res.status(200).json({
      price: quote?.regularMarketPrice ?? "N/A",
      calls: options.calls ?? [],
      puts: options.puts ?? [],
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
