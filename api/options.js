import * as eta from 'eta';

export default async function handler(req, res) {
  const { ticker = "SPY" } = req.query;

  const data = {
    title: `Options for ${ticker}`,
    user: "Randy",
    items: ["Call 420C", "Put 410P", "Call 430C"]
  };

  const template = `
  <!DOCTYPE html>
  <html>
    <head>
      <title><%= it.title %></title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">
      <h1>Hello <%= it.user %>!</h1>
      <ul class="list-group">
        <% for (let item of it.items) { %>
          <li class="list-group-item"><%= item %></li>
        <% } %>
      </ul>
    </body>
  </html>`;

  try {
    const html = eta.render(template, data);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("Eta render failed:", error);
    res.status(500).send("Template rendering error.");
  }
}