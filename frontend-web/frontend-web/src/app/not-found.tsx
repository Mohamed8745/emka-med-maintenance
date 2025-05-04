"use client";

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function NotFound() {
  const { t } = useTranslation('notFound');

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/">
        <button style={{ padding: '10px 20px', marginTop: '20px' }}>
          {t('backToHome')}
        </button>
      </Link>
    </div>
  );
}