import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "Missing ticker" });

  const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/options/${ticker}`;

  try {
    const response = await fetch(yahooUrl);

    if (!response.ok) {
      console.error("Yahoo response error:", response.status);
      return res.status(502).json({ error: `Yahoo returned ${response.status}` });
    }

    const data = await response.json();

    const result = data?.optionChain?.result?.[0];
    if (!result || !result.options?.length) {
      return res.status(404).json({ error: "No options data found" });
    }

    const quote = result.quote;
    const options = result.options[0];

    return res.status(200).json({
      price: quote?.regularMarketPrice ?? null,
      calls: options.calls ?? [],
      puts: options.puts ?? [],
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Fetch failed" });
  }
}
