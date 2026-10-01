"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductList from "@/components/ProductList";
import ProductFilter from "@/components/ProductFilter";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import ResetFilters from "@/components/ResetFilters";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const handleReset = () => {
    setFilteredProducts(products);
    setSelectedCategory("All");
  };

  return (
    <main className="p-5">
      <h1 className="mb-5 ml-5 text-2xl font-bold text-white">
        Products
      </h1>

      <div className="flex items-center gap-2">
        <ProductFilter
          products={products}
          setFilteredProducts={setFilteredProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ResetFilters onReset={handleReset} />
      </div>

      <ProductList products={filteredProducts} />
    </main>
  );
}

