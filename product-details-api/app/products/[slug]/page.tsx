import ProductDetails from "@/components/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const id = slug.split("-")[0];

  const response = await fetch(
    `https://fakestoreapi.com/products/${id}`
  );

  const product = await response.json();

  return (
    <main className="p-5">
      <ProductDetails product={product} />
    </main>
  );
}

