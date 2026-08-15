import { CartProvider } from "@/lib/cart/cart-context";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { ContactFab } from "@/components/storefront/contact-fab";
import { MiniCart } from "@/components/storefront/mini-cart";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ContactFab />
      <MiniCart />
    </CartProvider>
  );
}
