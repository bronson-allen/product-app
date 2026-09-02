import cors from "cors";
import express from "express";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/products",
});

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/api/products", async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name, price, cost FROM products ORDER BY id"
  );
  const products = result.rows.map(({ cost, ...product }) => ({
    ...product,
    profit:
      product.price != null && cost != null
        ? calculateProfit(Number(product.price), Number(cost))
        : null,
  }));
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const price = Number(req.body?.price);

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  if (Number.isNaN(price) || price < 0) {
    res.status(400).json({ error: "price must be a non-negative number" });
    return;
  }

  const result = await pool.query(
    "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
    [name, price]
  );
  res.status(201).json(result.rows[0]);
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

const calculateProfit = (price: number, cost: number) => {
  if (price === 0) {
    return "0.00";
  }
  return ((1 - cost / price) * 100).toFixed(2);
};
