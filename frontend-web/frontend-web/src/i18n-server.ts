import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { headers } from 'next/headers';

const i18nServer = i18n.createInstance();

i18nServer
  .use(HttpBackend)
  .init({
    lng: 'fr', // اللغة الافتراضية
    fallbackLng: 'fr',
    supportedLngs: ['en', 'fr', 'ar'],
    backend: {
      loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export const getServerLanguage = async () => {
  const supportedLngs = ['en', 'fr', 'ar'];
  const headersList = await headers(); // إضافة await للتعامل مع Promise
  const acceptLanguage = headersList.get('accept-language');
  
  if (acceptLanguage) {
    // استخراج اللغة الأساسية من رأس Accept-Language (مثل "en" من "en-US")
    const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
    if (supportedLngs.includes(primaryLang)) {
      return primaryLang;
    }
  }
  
  // الرجوع إلى الفرنسية إذا لم يتم العثور على لغة مدعومة
  return 'fr';
};

export default i18nServer;