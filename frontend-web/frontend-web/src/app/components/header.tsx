"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./../styles/header.module.css";
import { getUser } from "../services/authService";
import ProfileModal from "../components/ProfileModal";
import SettingModal from "../components/SettingModal";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import stockService from "../services/stockService";
import { ChevronDown, ChevronRight, Home, Package, FileText, Wrench, Users, Box, Layers, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  translations?: {
    language: string;
    theme: string;
    language_options: {
      ar: string;
      fr: string;
      en: string;
    };
    theme_options: {
      light: string;
      dark: string;
      system: string;
    };
  };
  children?: React.ReactNode;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  numidentif: string;
  numtel: string;
  image: string | null;
}

const getNavItems = (role: string, t: any) => {
  const icons = {
    dashboard: <Home size={18} />,
    machine: <Wrench size={18} />,
    maintenance: <Wrench size={18} />,
    stock: <Package size={18} />,
    rapport: <FileText size={18} />,
    user: <Users size={18} />,
  };

  const items = {
    Technicien: [
      { title: t("header.dashboard"), id: "dashboard", icon: icons.dashboard },
      { title: t("header.machine"), id: "machine", icon: icons.machine },
      { title: t("header.maintenance"), id: "maintenance", icon: icons.maintenance },
      { title: t("header.stock"), id: "stock", icon: icons.stock },
      { title: t("header.rapport"), id: "rapport", icon: icons.rapport },
    ],
    Operateur: [
      { title: t("header.dashboard"), id: "dashboard", icon: icons.dashboard },
      { title: t("header.machine"), id: "machine", icon: icons.machine },
      { title: t("header.maintenance"), id: "maintenance", icon: icons.maintenance },
      { title: t("header.rapport"), id: "rapport", icon: icons.rapport },
    ],
    Admin: [
      { title: t("header.dashboard"), id: "dashboard", icon: icons.dashboard },
      { title: t("header.users"), id: "user", icon: icons.user },
    ],
    Magasinier: [
      { title: t("header.dashboard"), id: "dashboard", icon: icons.dashboard },
      { title: t("header.stock"), id: "stock", icon: icons.stock },
      { title: t("header.rapport"), id: "rapport", icon: icons.rapport },
    ],
    Responsable: [
      { title: t("header.dashboard"), id: "dashboard", icon: icons.dashboard },
      { title: t("header.machine"), id: "maintenance", icon: icons.maintenance },
      { title: t("header.maintenance"), id: "rapport", icon: icons.maintenance },
      { title: t("header.rapport"), id: "rapport", icon: icons.rapport },
    ],
  };

  return items[role as keyof typeof items] || [];
};

export default function Header({ translations, children }: HeaderProps) {
  const { t } = useTranslation("common");
  const { logout } = useAuth(); // استخدام logout من AuthContext
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [navItems, setNavItems] = useState<{ title: string; id: string; icon: React.ReactNode }[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [stocks, setStocks] = useState<{ id: number; name: string }[]>([]);
  const [showStockList, setShowStockList] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedUser = useRef(false);
  const translationRef = useRef(t);

  useEffect(() => {
    translationRef.current = t;
  }, [t]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await stockService.getStocks() as { id: number; name: string }[];
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setError(translationRef.current("header.errorFetchingStocks"));
      }
    };

    fetchStocks();
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingUser(true);
      setError(null);
      const userData = await getUser();
      if (!userData) {
        window.location.href = "/pages/login";
        return;
      }
      setUser(userData);
      setNavItems(getNavItems(userData.role, translationRef.current));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(translationRef.current("header.errorFetchingUser"));
    } finally {
      setIsLoadingUser(false);
      hasFetchedUser.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasFetchedUser.current) {
      fetchUser();
    }
  }, [fetchUser]);

  const handleMenuClick = async (id: string) => {
    if (isLoadingUser) return;

    switch (id) {
      case "profile":
        setShowProfile(true);
        break;
      case "setting":
        setShowSetting(true);
        break;
      case "logout":
        await logout(); // استخدام logout من AuthContext
        window.location.replace("/pages/login");
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  const profileMenuItems = [
    { title: user?.username || t("header.guest"), id: "username", icon: null },
    { title: t("header.profile"), id: "profile", icon: <Users size={16} /> },
    { title: t("header.setting"), id: "setting", icon: <Settings size={16} /> },
    { title: t("header.logout"), id: "logout", icon: <LogOut size={16} /> },
  ];

  if (isLoadingUser) {
    return <div className={styles.loading}>{t("header.loading")}</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchUser} className={styles.retryButton}>
          {t("header.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.button
              className={styles.iconButton}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform="matrix(0.707108 -0.707105 0.707108 0.707105 0 19.864)"
                    fill="var(--bg2-color)"
                  />
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform="matrix(0.707108 0.707106 -0.707107 0.707106 2.13623 0)"
                    fill="var(--bg2-color)"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 30 22" fill="none">
                  <rect width="30" height="6" rx="3" fill="var(--bg2-color)" />
                  <rect y="8" width="30" height="6" rx="3" fill="var(--bg2-color)" />
                  <rect y="16" width="30" height="6" rx="3" fill="var(--bg2-color)" />
                </svg>
              )}
            </motion.button>
            <div className={styles.logo}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.9 42">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path d="M8.21,16.77c.17.61.78.92,1.82.92a11.27,11.27,0,0,0,4.55-1.34,6.71,6.71,0,0,1,2.2-.78,3.49,3.49,0,0,1,1.3.24c.41.16.61.33.61.5s-.23.43-.68.72a25.29,25.29,0,0,1-2.84,1.58,29.74,29.74,0,0,1-3.11,1.28,21.93,21.93,0,01-3,.8,13.77,13.77,0,0,1-2.66.3A8.73,8.73,0,0,1,1.75,19.9,3.28,3.28,0,0,1,0,17a6.89,6.89,0,0,1,.92-3.13A13.26,13.26,0,0,1,3.41,10.6a15.29,15.29,0,0,1,4.52-3A16.09,16.09,0,0,1,14.28,6.2a5.71,5.71,0,0,1,3.44.91A2.91,2.91,0,0,1,19,9.6a4.36,4.36,0,0,1-1,2.57,10.85,10.85,0,0,1-2.93,2.58,16.57,16.57,0,0,1-3.12,1.61,7.54,7.54,0,0,1-2.67.58A3.6,3.6,0,0,1,8.21,16.77Zm0-.49a6.89,6.89,0,0,0,1.63-.94,7.31,7.31,0,0,0,1.91-2.27,7.07,7.07,0,0,0,.84-1.87,7,7,0,0,0,.31-1.94q0-.84-.54-.84c-.5,0-1.26.72-2.29,2.15a16.32,16.32,0,0,0-1.48,2.58A5.67,5.67,0,0,0,8,15.37,3.12,3.12,0,0,0,8.17,16.28Z" fill="var(--bg2-color)" />
                    <path d="M43.57,15.51l-6.36,4.26a12,12,0,0,1-2,1.11,4.72,4.72,0,0,1-1.67.29,4,4,0,0,1-2.39-.69,2,2,0,0,1-1-1.7,3.83,3.83,0,0,1,.29-1.36,17.78,17.78,0,0,1,1.16-2.2,5.78,5.78,0,0,1,.31-.53,3.46,3.46,0,0,0,.25-.37l-.09-.06c-1.51,1-3,2.13-4.44,3.27-1.21.95-2.18,1.65-2.89,2.12a11.18,11.18,0,0,1-1.94,1.05,4,4,0,0,1-1.54.35,3.55,3.55,0,0,1-2.4-.77A2.69,2.69,0,0,1,18,18.16q0-1.69,2.24-5.47A27.69,27.69,0,0,1,23.35,8.2,5.09,5.09,0,0,1,27,6.61,4.94,4.94,0,0,1,29.12,7c.55.26.82.6.82,1a8.31,8.31,0,0,1-1.32,3.49c-.34.58-.69,1.23-1.05,2l.1.06c.57-.41,1.5-1.13,2.77-2.14a42.58,42.58,0,0,1,5-3.61,7.87,7.87,0,0,1,4-1.31,3.45,3.45,0,0,1,1.51.35,3,3,0,0,1,1.16.94A2,2,0,0,1,42.48,9,11.5,11.5,0,0,1,41,12.33l-.47.88a4.54,4.54,0,0,1-.3.55l.12.06.58-.38.57-.36.6-.36c.42-.26,1.47-1,3.16-2.09A18.19,18.19,0,0,1,47.94,9a4.45,4.45,0,0,1,1.84-.44A3.33,3.33,0,0,1,52,9.16a2.39,2.39,0,0,1,.75,1.91,12.62,12.62,0,0,1-.37,2.46c-.22,1.26-.37,2.24-.45,3a13.91,13.91,0,0,0-.13,1.5,7.15,7.15,0,0,0,.06.82A9,9,0,0,0,52,19.86c.1.38.22.8.38,1.25a12.71,12.71,0,0,1,.37,1.31c-.12.37-.53.68-1.22.93a6.42,6.42,0,0,1-2.26.38,6.34,6.34,0,0,1-3.59-1.12,5.21,5.21,0,0,1-1.15-1.05A3.15,3.15,0,0,1,44,20.31a8.85,8.85,0,0,1-.17-1.91c0-.52.09-1.59.28-3.21L44,15.13Z" fill="var(--bg2-color)" />
                    <path d="M74.78,23.73q-3.25,2.74-5,2.75a6.24,6.24,0,0,1-2.6-.64,10.23,10.23,0,0,1-2.55-1.7,8.89,8.89,0,0,1-1.89-2.33,4.82,4.82,0,0,1-.7-2.37,1,1,0,0,1,.33-.86,5.23,5.23,0,0,1,.62-.3c2.62-1.06,3.92-2.06,3.92-3,0-.5-.33-.75-1-.75a5,5,0,0,0-2.76,1.35,16,16,0,0,0-3.07,3.3,5.25,5.25,0,0,1-1.4,1.57,3.53,3.53,0,0,1-1.66.3,4.76,4.76,0,0,1-2.14-.45,3.33,3.33,0,0,1-1.42-1.28,3.6,3.6,0,0,1-.5-1.89,11.78,11.78,0,0,1,.63-3.6,20.69,20.69,0,0,1,1.76-3.91,27.91,27.91,0,0,1,2.7-3.84,26.92,26.92,0,0,1,3.26-3.31A10.41,10.41,0,0,1,67.9,0a8.13,8.13,0,0,1,2.84.47,4.31,4.31,0,0,1,1.92,1.34,3.23,3.23,0,0,1,.68,2,4.61,4.61,0,0,1-1.08,2.82A8.08,8.08,0,0,1,69.48,9a7.37,7.37,0,0,1-3.45.9q-.81,0-.81-.39a2,2,0,0,1,.42-.71,9.56,9.56,0,0,0,2-6q0-.87-.33-.87c-.15,0-.39.15-.71.45a6.33,6.33,0,0,0-.92,1.08A25.44,25.44,0,0,0,62,12.06c0,.18-.1.41-.15.69s-.12.61-.2,1l.09.06a16.78,16.78,0,0,1,1.58-1.32A13,13,0,0,1,65,11.53a13.05,13.05,0,0,1,5.88-1.61,4.4,4.4,0,0,1,2.3.53,1.57,1.57,0,0,1,.9,1.37,6.4,6.4,0,0,1-2,4.23,13.11,13.11,0,0,1-1.3,1.27c-.49.41-1.19.95-2.11,1.61a22.91,22.91,0,0,0,1.92,1.87A15.21,15.21,0,0,0,73,22.45,7.11,7.11,0,0,1,74.78,23.73Z" fill="var(--bg2-color)" />
                    <path d="M90.06,16.59v.06l-.1-.06a39.59,39.59,0,0,1-4,2.72,20.2,20.2,0,0,1-3.34,1.59,8.49,8.49,0,0,1-2.81.53,7.63,7.63,0,0,1-4.32-1.14,3.4,3.4,0,0,1-1.7-2.89,5.38,5.38,0,0,1,.84-2.56A13,13,0,0,1,77,11.94,21.17,21.17,0,0,1,83.13,8,18.61,18.61,0,0,1,90.5,6.35a13,13,0,0,1,4.91.8c1.29.54,1.93,1.21,1.93,2a2.86,2.86,0,0,1-1,1.9,4.2,4.2,0,0,1,1.59.18c.21.12.32.39.32.81a5.2,5.2,0,0,0-.11.63c-.1,1-.14,1.94-.14,2.82,0,.45,0,.8,0,1s0,.51.09.81.1.55.14.73a5.64,5.64,0,0,0,.61,1.42,11.83,11.83,0,0,1-2.68,1.32,8.39,8.39,0,0,1-2.62.41Q90,21.23,90,17.3A4.25,4.25,0,0,1,90.06,16.59Zm1.4-3.49-.45.09a14.75,14.75,0,0,1-2.42.31c-.61,0-.91-.1-.91-.31a1.61,1.61,0,0,1,.37-.56,3.63,3.63,0,0,0,1.31-2.44A2.15,2.15,0,0,0,89,9c-.24-.37-.49-.55-.77-.55A2.57,2.57,0,0,0,87.09,9a16.7,16.7,0,0,0-3.44,3.16A4.85,4.85,0,0,0,82.38,15a1.93,1.93,0,0,0,.53,1.39,1.73,1.73,0,0,0,1.31.55,7.27,7.27,0,0,0,2.54-1,40.5,40.5,0,0,0,4.16-2.49l.63-.34Z" fill="var(--bg2-color)" />
                    <path d="M54,39.07V23.27h.9v15.8Zm.63-14.35V23.27h4.18v1.45Zm0,7.37V30.64h3.68v1.45Z" fill="var(--bg2-color)" />
                    <path d="M61.78,25.14V23.58h.91v1.56Zm0,13.93V27.79h.91V39.07Z" fill="var(--bg2-color)" />
                    <path d="M65.53,39.07l2.3-6.16.46,1.31-1.77,4.85Zm4.25,0-1.9-5.22L65.6,27.79h1l1.77,5.05,2.4,6.23ZM68.5,33.81l-.43-1.16,1.6-4.86h1Z" fill="var(--bg2-color)" />
                    <path d="M73.51,39.07V23.27h.9v15.8Zm.65-6.13V31.48h2.43a1.07,1.07,0,0,0,1-.7,4.14,4.14,0,0,0,.36-1.88V27.35a4.27,4.27,0,0,0-.36-1.92,1.08,1.08,0,0,0-1-.71H74.16V23.27h2.38a1.67,1.67,0,0,1,1.21.49,3.28,3.28,0,0,1,.79,1.41,7.7,7.7,0,0,1,.27,2.17v1.57a7.53,7.53,0,0,1-.27,2.14,3.24,3.24,0,0,1-.79,1.4,1.68,1.68,0,0,1-1.21.49Z" fill="var(--bg2-color)" />
                    <path d="M81.52,39.07V27.79h.9V39.07Zm3.39-9.64a.78.78,0,0,0-.26-.28.69.69,0,0,0-.36-.09,1.51,1.51,0,0,0-1.35.76,4,4,0,0,0-.52,2.11l-.13-2.17a4.1,4.1,0,0,1,.93-1.59,1.77,1.77,0,0,1,1.27-.57.72.72,0,0,1,.4.12.9.9,0,0,1,.31.33Z" fill="var(--bg2-color)" />
                    <path d="M89.82,39.23a1.86,1.86,0,0,1-1.68-1.07,6.38,6.38,0,0,1-.59-3V31.66a6.3,6.3,0,0,1,.59-3,1.87,1.87,0,0,1,1.68-1.06,1.84,1.84,0,0,1,1.67,1.06,6.19,6.19,0,0,1,.59,3v3.51a6.19,6.19,0,0,1-.59,3A1.82,1.82,0,0,1,89.82,39.23Zm0-1.45a1.11,1.11,0,0,0,1-.69,4.17,4.17,0,0,0,.35-1.91V31.65a4.15,4.15,0,0,0-.35-1.91,1.11,1.11,0,0,0-1-.67,1.08,1.08,0,0,0-1,.67,4.13,4.13,0,0,0-.36,1.91v3.53a4.16,4.16,0,0,0,.36,1.91A1.09,1.09,0,0,0,89.81,37.78Z" fill="var(--bg2-color)" />
                    <polygon points="30.9 29.43 25.01 29.36 22.82 25.67 9.48 25.67 8.62 27.52 3.37 27.52 3.37 26.59 8.16 26.59 9.02 24.74 23.23 24.74 25.42 28.44 30.91 28.51 30.9 29.43" fill="var(--bg2-color)" />
                    <path d="M2.07,29.68c-.95,0-1.7-1.29-1.7-2.93s.75-2.94,1.7-2.94,1.7,1.29,1.7,2.94S3,29.68,2.07,29.68Zm0-4.92c-.43,0-.9.81-.9,2s.47,2,.9,2,.9-.81.9-2S2.49,24.76,2.07,24.76Z" fill="var(--bg2-color)" />
                    <path d="M32.2,32.15c-1,0-1.7-1.29-1.7-2.94s.75-2.94,1.7-2.94,1.7,1.29,1.7,2.94S33.15,32.15,32.2,32.15Zm0-4.93c-.42,0-.9.82-.9,2s.48,2,.9,2,.9-.82.9-2S32.63,27.22,32.2,27.22Z" fill="var(--bg2-color)" />
                    <path d="M10.9,33.38c-1,0-1.7-1.29-1.7-2.94S10,27.5,10.9,27.5s1.7,1.29,1.7,2.94S11.85,33.38,10.9,33.38Zm0-4.93c-.42,0-.9.82-.9,2s.48,2,.9,2,.9-.82.9-2S11.33,28.45,10.9,28.45Z" fill="var(--bg2-color)" />
                    <path d="M21.81,33.38c-.95,0-1.7-1.29-1.7-2.94s.75-2.94,1.7-2.94,1.7,1.29,1.7,2.94S22.76,33.38,21.81,33.38Zm0-4.93c-.42,0-.9.82-.9,2s.48,2,.9,2,.9-.82.9-2S22.24,28.45,21.81,28.45Z" fill="var(--bg2-color)" />
                    <polygon points="12.2 30.94 12.2 29.94 20.51 29.91 20.51 30.9 12.2 30.94" fill="var(--bg2-color)" />
                    <polygon points="13.24 40.18 13.23 39.18 29.76 38.97 34.03 32.41 40.87 32.41 42.74 28.71 47 28.64 47.01 29.64 43.22 29.7 41.34 33.4 34.44 33.4 30.18 39.96 13.24 40.18" fill="var(--bg2-color)" />
                    <path d="M11.94,42c-.95,0-1.7-1.29-1.7-2.94s.75-2.93,1.7-2.93,1.7,1.29,1.7,2.93S12.89,42,11.94,42Zm0-4.93c-.43,0-.9.82-.9,2s.47,2,.9,2,.9-.81.9-2S12.36,37.07,11.94,37.07Z" fill="var(--bg2-color)" />
                    <path d="M47.79,32.15c-.95,0-1.7-1.29-1.7-2.94s.75-2.94,1.7-2.94,1.7,1.29,1.7,2.94S48.74,32.15,47.79,32.15Zm0-4.93c-.43,0-.9.82-.9,2s.47,2,.9,2,.9-.82.9-2S48.21,27.22,47.79,27.22Z" fill="var(--bg2-color)" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
          {children}
          <div className={styles.profileMenu}>
            <motion.button
              className={styles.avatarButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt="User Avatar"
                  className={styles.avatarImage}
                  style={{
                    width: "54px",
                    height: "54px",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "50%",
                  } as React.CSSProperties}
                />
              ) : (
                <span className={styles.avatarFallback}>
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </motion.button>
            <motion.div
              className={`${styles.dropdownContent} ${isDropdownOpen ? styles.open : styles.closed}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isDropdownOpen ? 1 : 0,
                y: isDropdownOpen ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
            >
              {profileMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.icon && <span className={styles.dropdownItemIcon}>{item.icon}</span>}
                  {item.title}
                </div>
              ))}
            </motion.div>
          </div>
        </header>

        <motion.aside
          className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}
          initial={{ x: -400 }}
          animate={{ x: isSidebarOpen ? 0 : -400 }}
          transition={{ duration: 0.5 }}
        >
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <div key={item.id} className={styles.navItem}>
                {item.id === "stock" ? (
                  <>
                    <div className={styles.navButton1}>
                      <Link href="/pages/stock" className={styles.navButtonTitle}>
                        <span className={styles.navIcon}>{item.icon}</span>
                        {item.title}
                      </Link>
                      <button
                        onClick={() => setShowStockList(!showStockList)}
                        className={styles.chevronButton}
                      >
                        {showStockList ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: showStockList ? "auto" : 0, opacity: showStockList ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={styles.subMenu}
                    >
                      {showStockList &&
                        stocks.map((stock, index) => (
                          <Link
                            key={stock.id}
                            href={`/pages/piece?stock=${stock.id}`}
                            className={styles.subMenuItem}
                          >
                            <span className={styles.subMenuIcon}>
                              {index % 2 === 0 ? <Box size={14} /> : <Layers size={14} />}
                            </span>
                            {stock.name}
                          </Link>
                        ))}
                    </motion.div>
                  </>
                ) : (
                  <Link href={`/pages/${item.id}`} className={styles.navButton}>
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </motion.aside>

        {showProfile && user && (
          <ProfileModal
            user={user}
            onClose={() => setShowProfile(false)}
            onSave={(updatedUser) => {
              setUser(updatedUser);
              setShowProfile(false);
            }}
          />
        )}
        {showSetting && (
          <SettingModal
            onClose={() => setShowSetting(false)}
          />
        )}
      </div>
    </div>
  );
}