import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { CartAnimationProvider } from "@/components/cart/CartAnimation";

export const metadata: Metadata = {
  title: "GatiMitra | Moving India Forward",
  description: "India's Lowest Commission Delivery Platform - Food • Parcel • Person Delivery",
  icons: {
    icon: "/img/fav.png",
    shortcut: "/img/fav.png",
    apple: "/img/fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <ReduxProvider>
          <CartAnimationProvider>
            {children}
          </CartAnimationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

