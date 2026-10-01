import "./globals.css";
import ChakraProviderComponent from "@/ui/ChakraProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a]">
        <ChakraProviderComponent>
          {children}
        </ChakraProviderComponent>
      </body>
    </html>
  );
}