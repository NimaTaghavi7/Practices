"use client";

import { useState } from "react";
import { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <main>
      <h1>Products</h1>
    </main>
  );
}