'use client';

import { useState } from "react";
import styles from "./../styles/header.module.css";
import { useTranslation } from "next-i18next"; // استيراد الترجمة

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation("common"); // استخدام الترجمة من ملف common.json

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearch}
      placeholder={placeholder || t("searchbar.search_placeholder")} // ترجمة النص الافتراضي
      className={styles.searchBar}
    />
  );
}

