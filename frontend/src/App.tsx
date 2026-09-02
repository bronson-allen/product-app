import { FormEvent, useEffect, useState } from "react";
import { createProduct, fetchProducts, Product } from "./api";

const GROSS_PROFIT_FLOOR = 30;

function isBelowProfitFloor(product: Product): boolean {
  return product.profit != null && Number(product.profit) < GROSS_PROFIT_FLOOR;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loadProducts() {
    try {
      setError("");
      setProducts(await fetchProducts());
    } catch {
      setError("Could not load products.");
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = Number(price);
    if (price.trim() === "" || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      await createProduct(name.trim(), parsedPrice);
      setName("");
      setPrice("");
      await loadProducts();
    } catch {
      setError("Could not create product.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Products</h1>
      </header>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter product name..."
          className="product-input"
          disabled={isLoading}
          autoFocus
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Enter product price..."
          className="product-input product-price-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn-submit"
          disabled={isLoading || !name.trim() || price.trim() === ""}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">No products found. Create one above!</div>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li
              key={product.id}
              className={`product-item${isBelowProfitFloor(product) ? " highlighted" : ""}`}
            >
              <span className="product-id">#{product.id}</span>
              <span className="product-name">{product.name}</span>
              <span className="product-meta">
                <span className="product-price">
                  {product.price != null
                    ? `$${Number(product.price).toFixed(2)}`
                    : "—"}
                </span>
                <span className="product-profit">
                  {product.profit != null
                    ? `${product.profit}%`
                    : "—"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
