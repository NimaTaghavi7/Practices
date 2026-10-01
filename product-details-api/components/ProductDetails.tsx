import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center p-5">
          <img
            src={product.image}
            alt={product.title}
            className="h-72 w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold  text-white">
            {product.title}
          </h1>

          <p className="mt-4 text-xl font-semibold  text-white">
            ${product.price}
          </p>

          <p className="mt-3 text-gray-400">
            Category: {product.category}
          </p>

          <p className="mt-3  text-white">
            ⭐ {product.rating.rate} ({product.rating.count})
          </p>

          <p className="mt-6 leading-7 text-gray-300">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}