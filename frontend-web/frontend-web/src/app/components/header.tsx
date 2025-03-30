"use client"

import React, { JSX, useState } from "react";
import { motion } from "framer-motion";
import styles from "./../styles/header.module.css";
import { ChevronDown, Menu, X } from "lucide-react";

interface Props {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

export default function header(){
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { title: "Dashboard", id: "dashboard" },
    { title: "Stock", id: "stock" },
    { title: "Rapport", id: "rapport" },
  ];

  const profileMenuItems = [
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
              {isSidebarOpen ?(
              <svg className={styles.iconButton} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              </svg> )
            : <svg className={styles.iconButton} width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="6" rx="3" fill="#1F6899"/><rect y="8" width="30" height="6" rx="3" fill="#1F6899"/><rect y="16" width="30" height="6" rx="3" fill="#1F6899"/></svg> 
            }
            </motion.button>
            <img className={styles.logo} alt="Asset" src="/../images/logo1.svg" />
          </div>
          <input type="text" className={styles.searchBar} placeholder="Search..." />
          <div className={styles.profileMenu}>
            <motion.button
              className={styles.avatarButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              R
            </motion.button>
            <motion.div
              className={`${styles.dropdownContent} ${isDropdownOpen ? styles.open : styles.closed}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isDropdownOpen ? 1 : 0, y: isDropdownOpen ? 0 : -10 }}
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
          className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}
          initial={{ x: -400 }}
          animate={{ x: isSidebarOpen ? 0 : -400 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <nav>
            {navItems.map((item) => (
              <button key={item.id} className={styles.navButton}>
                {item.title}
              </button>
            ))}
          </nav>
        </motion.aside>
      </div>
    </div>
  );
}
