import "./globals.css";


export const metadata = {
  title: "Product Details API ",
  description: "Product Details API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a]">
          {children}
        
      </body>
    </html>
  );
}