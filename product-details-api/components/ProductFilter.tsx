"use client";

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Product } from "@/types/product";

interface ProductFilterProps {
  products: Product[];
  setFilteredProducts: (products: Product[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function ProductFilter({
  products,
  setFilteredProducts,
  selectedCategory,
  setSelectedCategory,
}: ProductFilterProps) {
  const handleFilter = (category: string, title: string) => {
    setSelectedCategory(title);

    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category),
      );
    }
  };

  return (
    <Menu>
      <MenuButton
        marginLeft="20px"
        width="200px"
        height="40px"
        padding="0 12px"
        background="#0a0a0a"
        color="white"
        border="1px solid #444"
        borderRadius="6px"
        textAlign="left"
        cursor="pointer"
        _hover={{
          borderColor: "#777",
        }}
        _expanded={{
          borderColor: "#777",
        }}
      >
        {selectedCategory}

        <ChevronDownIcon float="right" marginTop="3px" boxSize={5} />
      </MenuButton>

      <MenuList
        background="#0a0a0a"
        borderColor="#444"
        borderRadius="8px"
        padding="5px"
      >
        <MenuItem
          background="#0a0a0a"
          color="white"
          onClick={() => handleFilter("all", "All")}
          _hover={{ background: "#222" }}
        >
          All
        </MenuItem>

        <MenuItem
          background="#0a0a0a"
          color="white"
          onClick={() => handleFilter("electronics", "electronics")}
          _hover={{ background: "#222" }}
        >
          electronics
        </MenuItem>

        <MenuItem
          background="#0a0a0a"
          color="white"
          onClick={() => handleFilter("jewelery", "jewelery")}
          _hover={{ background: "#222" }}
        >
          jewelery
        </MenuItem>

        <MenuItem
          background="#0a0a0a"
          color="white"
          onClick={() => handleFilter("men's clothing", "men's clothing")}
          _hover={{ background: "#222" }}
        >
          men's clothing
        </MenuItem>

        <MenuItem
          background="#0a0a0a"
          color="white"
          onClick={() => handleFilter("women's clothing", "women's clothing")}
          _hover={{ background: "#222" }}
        >
          women's clothing
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
