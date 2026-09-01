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
    "SELECT id, name FROM products ORDER BY id"
  );
  res.json(result.rows);
});

app.post("/api/products", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const result = await pool.query(
    "INSERT INTO products (name) VALUES ($1) RETURNING id, name",
    [name]
  );
  res.status(201).json(result.rows[0]);
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
