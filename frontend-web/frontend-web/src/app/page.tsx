import { Metadata, Viewport } from "next";
import HomeClient from "./HomeClient";
import i18next from "i18next";
import fs from "fs/promises";
import path from "path";

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
export async function generateMetadata({
  params = { lng: "fr" },
}: {
  params?: { lng: string };
}): Promise<Metadata> {
  await initI18n(params.lng);
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
