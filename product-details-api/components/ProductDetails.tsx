import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border p-5">
      <img
        src={product.image}
        alt={product.title}
        className="mx-auto h-64 object-contain"
      />

      <h1 className="mt-5 text-2xl font-bold">
        {product.title}
      </h1>

      <p className="mt-3">
        Price: ${product.price}
      </p>

      <p className="mt-2">
        Category: {product.category}
      </p>

      <p className="mt-2">
        ⭐ {product.rating.rate} ({product.rating.count})
      </p>

      <p className="mt-4">
        {product.description}
      </p>
    </div>
  );
}

