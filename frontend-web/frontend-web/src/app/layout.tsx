import { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

// تعريف البيانات الوصفية العامة للتطبيق
export const metadata: Metadata = {
  title: {
    default: "Emka Med Maintenance",
    template: "%s | Emka Med Maintenance",
  },
  description: "A platform for medical equipment maintenance and management.",
  viewport: "width=device-width, initial-scale=1",
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
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