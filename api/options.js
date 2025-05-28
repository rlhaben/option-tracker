export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "Missing ticker" });

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/options/${ticker}`;
    const response = await fetch(url);
    const data = await response.json();

    const result = data.optionChain.result[0];
    const quote = result.quote;
    const options = result.options[0];

    res.status(200).json({
      price: quote.regularMarketPrice,
      calls: options.calls,
      puts: options.puts,
    });
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
}