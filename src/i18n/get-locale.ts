import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./dictionaries";
import { LOCALE_COOKIE } from "./constants";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}
