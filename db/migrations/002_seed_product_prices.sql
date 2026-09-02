-- Seed prices for any existing products that are missing one.
UPDATE products
SET price = ROUND((RANDOM() * 50 + 1)::numeric, 2)
WHERE price IS NULL;
