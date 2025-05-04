import LoginClient from './LoginClient';
import i18nServer, { getServerLanguage } from '../../../i18n-server';
import i18next from "i18next";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";


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


export default async function Login() {
  const lng = await getServerLanguage();
  await i18nServer.changeLanguage(lng);
  return <LoginClient lng={lng} />;
}