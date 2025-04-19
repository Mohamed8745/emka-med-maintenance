import type { UserConfig } from "next-i18next";

const config: UserConfig = {
  i18n: {
    defaultLocale: "fr",
    locales: ["en", "fr", "ar"],
    localeDetection: false,
  },
  localePath: "./public/locales",
};

export default config;