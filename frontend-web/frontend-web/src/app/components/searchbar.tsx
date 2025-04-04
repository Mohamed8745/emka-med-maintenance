'use client'

import { useState } from "react";
import styles from "./../styles/header.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: { onSearch: (query: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearch}
      placeholder={placeholder || "Search..."}
      className={styles.searchBar} 
      />
  );
};

