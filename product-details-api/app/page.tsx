"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductList from "@/components/ProductList";
import ProductFilter from "@/components/ProductFilter";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="p-5">
      <h1 className="mb-5 ml-5 text-2xl font-bold">
        Products
      </h1>

      <ProductFilter
        products={products}
        setFilteredProducts={setFilteredProducts}
      />

      <ProductList products={filteredProducts} />
    </main>
  );
}

