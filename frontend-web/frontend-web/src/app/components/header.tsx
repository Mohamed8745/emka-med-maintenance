"use client";

import React, { JSX, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./../styles/header.module.css";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { getUser } from "../services/authService"; // Import authService as a named export

interface User {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
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

const fetchUserData = async () => {
  try {
    const user = await getUser();
    if (user) {
      console.log("User:", user);
    } else {
      console.log("User not authenticated");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export default function header({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [navItems, setNavItems] = useState<{ title: string; id: string }[]>([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser(); // استخدام authService لجلب بيانات المستخدم
        if (!userData) {
          console.error("User not found. Redirecting to login...");
          window.location.href = "/pages/login"; // إعادة التوجيه إلى صفحة تسجيل الدخول
          return;
        }

        setUser(userData);
        setNavItems(getNavItems(userData.role));
      } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "/pages/login"; // إعادة التوجيه إلى صفحة تسجيل الدخول في حالة الخطأ
      }
    }

    fetchUser();
  }, []);

  const profileMenuItems = [
    { title: user?.username || "Guest", id: "username" },
    { title: "Profile", id: "profile" },
    { title: "Setting", id: "setting" },
    { title: "Log out", id: "logout" },
  ];

  const scaleX: number = 0.707108;
  const scaleY: number = 0.707105;
  const translateX: number = 0;
  const translateY: number = 19.864;

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
                <svg
                  className={styles.iconButton}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform={`matrix(${scaleX} ${-scaleY} ${scaleX} ${scaleY} ${translateX} ${translateY})`}
                    fill="#1F6899"
                  />
                  <rect
                    width="28.092"
                    height="3.02079"
                    rx="1.5104"
                    transform="matrix(0.707108 0.707106 -0.707107 0.707106 2.13623 -3.8147e-06)"
                    fill="#1F6899"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.iconButton}
                  width="22"
                  height="22"
                  viewBox="0 0 30 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="30" height="6" rx="3" fill="#1F6899" />
                  <rect y="8" width="30" height="6" rx="3" fill="#1F6899" />
                  <rect y="16" width="30" height="6" rx="3" fill="#1F6899" />
                </svg>
              )}
            </motion.button>
            <img
              className={styles.logo}
              alt="Asset"
              src="/../images/logo1.svg"
            />
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
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: "#1F6899",
                    borderRadius: "50%",
                  }}
                >
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
                <div key={item.id} className={styles.dropdownItem}>
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
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <nav>
            {navItems.map((item) => (
              <Link href={`/pages/${item.id}`} key={item.id}>
                <button className={styles.navButton}>{item.title}</button>
              </Link>
            ))}
          </nav>
        </motion.aside>
      </div>
    </div>
  );
}
