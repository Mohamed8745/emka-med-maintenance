'use client';

import { ReactNode, useEffect } from "react";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import ThemeInitializer from "./components/ThemeInitializer";
import i18n from '../../i18n'; // Import the i18n initialization file

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  useEffect(() => {
    // This ensures that i18next is initialized before rendering any component
    i18n.init();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&family=Patrick+Hand&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Walter+Turncoat&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <ThemeInitializer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
