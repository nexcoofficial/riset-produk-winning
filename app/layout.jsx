import "./globals.css";
import { DataProvider } from "@/components/DataProvider";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Riset Produk Winning",
  description: "Tool pribadi riset produk winning untuk bisnis dropship/COD.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <DataProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:pb-10">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  );
}
