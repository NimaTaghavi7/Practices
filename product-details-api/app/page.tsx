"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductList from "@/components/ProductList";
import ProductFilter from "@/components/ProductFilter";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
        setFilteredProducts(data);
      })
      .catch(() => {
        setError("مشکلی در دریافت محصولات پیش آمد");
      });
  }, []);

  return (
    <main className="p-5">
      <h1 className="mb-5 text-2xl font-bold">Products</h1>

      {error && <p>{error}</p>}

      <ProductFilter
        products={products}
        setFilteredProducts={setFilteredProducts}
      />

      <ProductList products={filteredProducts} />
    </main>
  );
}