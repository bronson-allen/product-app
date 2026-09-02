-- Seed costs for any existing products that are missing one.
-- Cost is set to ~40–80% of price when price exists; otherwise a small random value.
UPDATE products
SET cost = ROUND(
  CASE
    WHEN price IS NOT NULL THEN price * (0.4 + RANDOM() * 0.4)
    ELSE RANDOM() * 20 + 0.5
  END::numeric,
  2
)
WHERE cost IS NULL;
