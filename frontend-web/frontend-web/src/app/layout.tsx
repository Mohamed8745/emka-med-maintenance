import { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: "Emka Med Maintenance",
    template: "%s | Emka Med Maintenance",
  },
  description: "A platform for medical equipment maintenance and management.",
};

interface LayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const cookieStore = await cookies();
  const savedLang = cookieStore.get("i18next")?.value;
  const lng = savedLang && ["en", "fr", "ar"].includes(savedLang) ? savedLang : "fr";
  const dir = lng === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lng} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&family=Patrick+Hand&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Walter+Turncoat&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}