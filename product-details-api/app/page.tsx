"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductList from "@/components/ProductList";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("مشکلی در دریافت محصولات پیش آمد");
      });
  }, []);

  return (
    <main>
      <h1>Products</h1>

      {error && <p>{error}</p>}

      <ProductList products={products} />
    </main>
  );
}