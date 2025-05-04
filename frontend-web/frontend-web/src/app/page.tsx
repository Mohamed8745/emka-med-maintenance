import { Metadata, Viewport } from "next";
import HomeClient from "./HomeClient";
import i18next from "i18next";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

// تهيئة i18next للخادم
async function initI18n(lng: string = "fr") {
  const localesPath = path.join(process.cwd(), "public", "locales");
  const resources = {
    en: {
      common: JSON.parse(
        await fs.readFile(path.join(localesPath, "en", "common.json"), "utf-8")
      ),
    },
    fr: {
      common: JSON.parse(
        await fs.readFile(path.join(localesPath, "fr", "common.json"), "utf-8")
      ),
    },
    ar: {
      common: JSON.parse(
        await fs.readFile(path.join(localesPath, "ar", "common.json"), "utf-8")
      ),
    },
  };

  await i18next.init({
    lng,
    fallbackLng: "fr",
    supportedLngs: ["en", "fr", "ar"],
    ns: ["common"],
    defaultNS: "common",
    resources,
  });
}

// توليد البيانات الوصفية
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const savedLang = cookieStore.get("i18next")?.value;
  const lng = savedLang && ["en", "fr", "ar"].includes(savedLang) ? savedLang : "fr";
  await initI18n(lng);
  const t = i18next.t.bind(i18next);
  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

// توليد إعدادات العرض
export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

export default function Home() {
  return <HomeClient />;
}