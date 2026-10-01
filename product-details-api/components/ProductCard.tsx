import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <img
        src={product.image}
        alt={product.title}
        className="h-48 w-full object-contain"
      />

      <h2 className="mt-4 text-lg font-semibold">
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
  );
}