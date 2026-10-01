import ProductSkeleton from "./ProductSkeleton";

export default function Loading() {
  return (
    <>
      <p className="ml-5 mb-5 p-5 text-2xl font-bold text-white">Loading...</p>

      <div className="grid grid-cols-1 mx-5 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
