import { FormEvent, useEffect, useState } from "react";
import { createProduct, fetchProducts, Product } from "./api";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
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

    setIsLoading(true);
    try {
      setError("");
      await createProduct(name.trim());
      setName("");
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
        <button type="submit" className="btn-submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">No products found. Create one above!</div>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <span className="product-id">#{product.id}</span>
              <span className="product-name">{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
