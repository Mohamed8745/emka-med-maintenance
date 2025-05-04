'use client';

import { useState } from "react";
import styles from "./../styles/header.module.css";
import { useTranslation } from "next-i18next";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation("common");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.searchBarContainer}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder || t("searchbar.search_placeholder")}
        className={styles.searchBar}
      />
    </div>
  );
}