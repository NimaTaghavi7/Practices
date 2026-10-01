import { Product } from "@/types/product";

interface ProductFilterProps {
  products: Product[];
  setFilteredProducts: (products: Product[]) => void;
}

export default function ProductFilter({
  products,
  setFilteredProducts,
}: ProductFilterProps) {
  const handleFilter = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category),
      );
    }
  };

  return (
    <select
      onChange={(e) => handleFilter(e.target.value)}
      className="rounded-md border border-gray-300 bg-[#0a0a0a] text-white px-3 py-2 ml-5 text-sm outline-none"
    >
      <option className="" value="all">
        All
      </option>
      <option className="" value="electronics">
        electronics
      </option>
      <option className="" value="jewelery">
        jewelery
      </option>
      <option className="" value="men's clothing">
        men's clothing
      </option>
      <option className="" value="women's clothing">
        women's clothing
      </option>
    </select>
  );
}
