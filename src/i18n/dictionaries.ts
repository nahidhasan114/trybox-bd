export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

export type Dictionary = {
  nav: {
    home: string;
    shop: string;
    categories: string;
    combo: string;
    newArrivals: string;
    bestSellers: string;
    offers: string;
    search: string;
    account: string;
    wishlist: string;
    cart: string;
    trackOrder: string;
    contact: string;
  };
  common: {
    addToCart: string;
    buyNow: string;
    viewCart: string;
    checkout: string;
    outOfStock: string;
    inStock: string;
    loading: string;
    seeAll: string;
    regularPrice: string;
    salePrice: string;
    quantity: string;
    remove: string;
    continueShopping: string;
    noProductFound: string;
    emptyCart: string;
  };
  footer: {
    quickLinks: string;
    customerCare: string;
    categories: string;
    connect: string;
    deliveryPolicy: string;
    returnPolicy: string;
    privacyPolicy: string;
    terms: string;
    rightsReserved: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  bn: {
    nav: {
      home: "হোম",
      shop: "শপ",
      categories: "ক্যাটাগরি",
      combo: "কম্বো অফার",
      newArrivals: "নতুন পণ্য",
      bestSellers: "বেস্ট সেলার",
      offers: "অফার",
      search: "খুঁজুন",
      account: "অ্যাকাউন্ট",
      wishlist: "উইশলিস্ট",
      cart: "কার্ট",
      trackOrder: "অর্ডার ট্র্যাক করুন",
      contact: "যোগাযোগ",
    },
    common: {
      addToCart: "কার্টে যোগ করুন",
      buyNow: "এখনই কিনুন",
      viewCart: "কার্ট দেখুন",
      checkout: "চেকআউট",
      outOfStock: "স্টক নেই",
      inStock: "স্টকে আছে",
      loading: "লোড হচ্ছে...",
      seeAll: "সব দেখুন",
      regularPrice: "নিয়মিত মূল্য",
      salePrice: "বিশেষ মূল্য",
      quantity: "পরিমাণ",
      remove: "মুছুন",
      continueShopping: "কেনাকাটা চালিয়ে যান",
      noProductFound: "কোনো পণ্য পাওয়া যায়নি",
      emptyCart: "আপনার কার্ট এখনো খালি।",
    },
    footer: {
      quickLinks: "দ্রুত লিংক",
      customerCare: "কাস্টমার কেয়ার",
      categories: "ক্যাটাগরি",
      connect: "যোগাযোগ করুন",
      deliveryPolicy: "ডেলিভারি নীতি",
      returnPolicy: "রিটার্ন নীতি",
      privacyPolicy: "প্রাইভেসি পলিসি",
      terms: "শর্তাবলী",
      rightsReserved: "সর্বস্বত্ব সংরক্ষিত",
    },
  },
  en: {
    nav: {
      home: "Home",
      shop: "Shop",
      categories: "Categories",
      combo: "Combo Offers",
      newArrivals: "New Arrivals",
      bestSellers: "Best Sellers",
      offers: "Offers",
      search: "Search",
      account: "Account",
      wishlist: "Wishlist",
      cart: "Cart",
      trackOrder: "Track Order",
      contact: "Contact",
    },
    common: {
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      viewCart: "View Cart",
      checkout: "Checkout",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      loading: "Loading...",
      seeAll: "See All",
      regularPrice: "Regular Price",
      salePrice: "Sale Price",
      quantity: "Quantity",
      remove: "Remove",
      continueShopping: "Continue Shopping",
      noProductFound: "No Product Found",
      emptyCart: "Your cart is empty.",
    },
    footer: {
      quickLinks: "Quick Links",
      customerCare: "Customer Care",
      categories: "Categories",
      connect: "Connect",
      deliveryPolicy: "Delivery Policy",
      returnPolicy: "Return Policy",
      privacyPolicy: "Privacy Policy",
      terms: "Terms & Conditions",
      rightsReserved: "All rights reserved",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
