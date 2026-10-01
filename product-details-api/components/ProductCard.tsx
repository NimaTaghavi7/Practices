import { Product } from "@/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const slug = product.id + "-" + product.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return (
    <Link href={`/products/${slug}`}>
      <div className="h-full rounded-lg border border-gray-200 p-4">
        <div className="p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-40 w-full object-contain"
          />
        </div>

        <h2 className="mt-4 h-14 text-lg font-semibold">
          {product.title}
        </h2>

        <p className="mt-2">${product.price}</p>

        <p className="mt-1 text-gray-500">
          {product.category}
        </p>

        <p className="mt-2">
          ⭐ {product.rating.rate} ({product.rating.count})
        </p>
      </div>
    </Link>
  );
}

