"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./../styles/header.module.css";
import { getUser, logout } from "../services/authService";
import ProfileModal from "../components/ProfileModal";
import SettingModal from "../components/SettingModal";
import Link from "next/link";

interface User {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  numidentif: string;
  numtel: string;
  image: string | null;
}

const getNavItems = (role: string) => {
  switch (role) {
    case "Technicien":
      return [
        { title: "Dashboard", id: "dashboard" },
        { title: "Machine", id: "machine" },
        { title: "Maintenance", id: "maintenance" },
        { title: "Stock", id: "stock" },
        { title: "Rapport", id: "rapport" },
      ];
    case "Operateur":
      return [
        { title: "Dashboard", id: "dashboard" },
        { title: "Machine", id: "machine" },
        { title: "Maintenance", id: "maintenance" },
        { title: "Rapport", id: "rapport" },
      ];
    case "Admin":
      return [
        { title: "Dashboard", id: "dashboard" },
        { title: "Users", id: "user" },
      ];
    case "Magasinier":
      return [
        { title: "Dashboard", id: "dashboard" },
        { title: "Stock", id: "stock" },
        { title: "Rapport", id: "rapport" },
      ];
    case "Responsable":
      return [
        { title: "Dashboard", id: "dashboard" },
        { title: "Machine", id: "maintenance" },
        { title: "Maintenance", id: "rapport" },
        { title: "Rapport", id: "rapport" },
      ];
    default:
      return [];
  }
};

export default function Header({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [navItems, setNavItems] = useState<{ title: string; id: string }[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        if (!userData) {
          window.location.href = "/pages/login";
          return;
        }

        setUser(userData);
        setNavItems(getNavItems(userData.role));
      } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "/pages/login";
      }
    }

    fetchUser();
  }, []);

  const handleMenuClick = async (id: string) => {
    switch (id) {
      case "profile":
        setShowProfile(true);
        break;
      case "setting":
        setShowSetting(true);
        break;
      case "logout":
        await logout();
        window.location.replace("/pages/login");
        break;
      default:
        break;
    }

    setIsDropdownOpen(false);
  };

  const profileMenuItems = [
    { title: user?.username || "Guest", id: "username" },
    { title: "Profile", id: "profile" },
    { title: "Setting", id: "setting" },
    { title: "Log out", id: "logout" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.button
              className={styles.iconButton}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {/* Burger/Menu Icon */}
              {isSidebarOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform="matrix(0.707108 -0.707105 0.707108 0.707105 0 19.864)"
                    fill="#1F6899"
                  />
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform="matrix(0.707108 0.707106 -0.707107 0.707106 2.13623 0)"
                    fill="#1F6899"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 30 22" fill="none">
                  <rect width="30" height="6" rx="3" fill="#1F6899" />
                  <rect y="8" width="30" height="6" rx="3" fill="#1F6899" />
                  <rect y="16" width="30" height="6" rx="3" fill="#1F6899" />
                </svg>
              )}
            </motion.button>
            <img className={styles.logo} alt="logo" src="/../images/logo1.svg" />
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
              className={`${styles.dropdownContent} ${
                isDropdownOpen ? styles.open : styles.closed
              }`}
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
                  {item.title}
                </div>
              ))}
            </motion.div>
          </div>
        </header>

        <motion.aside
          className={`${styles.sidebar} ${
            isSidebarOpen ? styles.open : styles.closed
          }`}
          initial={{ x: -400 }}
          animate={{ x: isSidebarOpen ? 0 : -400 }}
          transition={{ duration: 0.5 }}
        >
          <nav>
            {navItems.map((item) => (
              <Link href={`/pages/${item.id}`} key={item.id}>
                <button className={styles.navButton}>{item.title}</button>
              </Link>
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
        {showSetting && <SettingModal onClose={() => setShowSetting(false)} />}
      </div>
    </div>
  );
}
