import React from "react";
import styles from "./UserDrawer.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import defaultAvatar from "../../assets/default.jpg";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

function UserDrawer({ isOpen, onClose, user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div className={styles.userInfo}>
            <img
              src={user?.profile || defaultAvatar}
              alt="Avatar"
              className={styles.avatar}
            />
            <span className={styles.userName}>
              {user?.username || t("unknown")}
            </span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.menuList}>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("/profile")}
          >
            <span className={styles.icon}>👤</span>
            <span>{t("profile")}</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("/settings")}
          >
            <span className={styles.icon}>⚙️</span>
            <span>{t("settings")}</span>
          </button>

          <button
            className={`${styles.menuItem} ${styles.logoutBtn}`}
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            <span className={styles.icon}>🚪</span>
            <span>{t("logout")}</span>
          </button>
        </nav>

        <div className={styles.drawerFooter}>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}

export default UserDrawer;
