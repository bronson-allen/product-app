export type Product = {
  id: number;
  name: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to load products");
  }
  return response.json();
}

export async function createProduct(name: string): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}
