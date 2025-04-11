'use client';

import { appWithTranslation } from 'next-i18next';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import ThemeInitializer from '../components/ThemeInitializer';

function MyApp({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  return (
    <AuthProvider>
      <ThemeInitializer />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
