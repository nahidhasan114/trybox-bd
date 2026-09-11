import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/i18n/locale-provider";
import { getLocale } from "@/i18n/get-locale";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const dynamic = "force-dynamic";

const bodyFont = Hind_Siliguri({
  variable: "--font-body",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: settings.seo_default_title || settings.business_name,
      template: `%s | ${settings.business_name}`,
    },
    description: settings.seo_default_description,
    openGraph: {
      siteName: settings.business_name,
      type: "website",
      locale: "bn_BD",
      images: settings.logo_url ? [settings.logo_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <LocaleProvider initialLocale={locale}>
          {children}
          <Toaster position="top-center" richColors />
        </LocaleProvider>
      </body>
    </html>
  );
}
