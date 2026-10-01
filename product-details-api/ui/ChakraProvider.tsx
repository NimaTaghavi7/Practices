"use client";

import { ChakraProvider } from "@chakra-ui/react";

export default function ChakraProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProvider resetCSS={false}>{children}</ChakraProvider>;
}
