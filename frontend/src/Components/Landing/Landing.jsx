import React, { useEffect } from "react";
import styles from "./Landing.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { getUsername } from "../../helper/helper";
import logo from "../../assets/logo.png";

function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUsername()
        .then(() => navigate("/home"))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  return (
    <div className={styles.landingContainer}>
      <header className={styles.navBar}>
        <div className={styles.brand}>
          <img src={logo} alt="Beerdex Logo" className={styles.brandLogo} />
          <span className={styles.brandText}>Beerdex</span>
        </div>
        <div className={styles.navActions}>
          <LanguageSelector />
          <Link to="/login" className={styles.loginLink}>
            {t("loginCTA")}
          </Link>
        </div>
      </header>

      <main className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          <span className={styles.brandTitleGradient}>Beerdex</span>
          <span className={styles.heroTagline}>{t("landingHeroTag")}</span>
        </h1>

        <p className={styles.heroDesc}>{t("landingHeroDesc")}</p>

        <div className={styles.ctaGroup}>
          <Link to="/register" className={styles.btnPrimary}>
            <span>🚀</span>
            <span>{t("registerCTA")}</span>
          </Link>
          <Link to="/login" className={styles.btnSecondary}>
            <span>🔑</span>
            <span>{t("loginCTA")}</span>
          </Link>
        </div>

        <div className={styles.previewWrapper}>
          <div className={styles.previewCard}>
            <div className={styles.previewImg}>🍺</div>
            <div className={styles.previewContent}>
              <div className={styles.previewHeader}>
                <h4>Desperados</h4>
                <span className={styles.ratingBadge}>⭐ 9/10</span>
              </div>
              <div className={styles.variant}>Red Guarana Edition</div>
              <p className={styles.desc}>
                {t("exampleDesc")} — pyszny, mocno schłodzony w letni wieczór!
              </p>
            </div>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>{t("featureCatch")}</h3>
            <p>{t("featureCatchDesc")}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t("featureRate")}</h3>
            <p>{t("featureRateDesc")}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t("featureStats")}</h3>
            <p>{t("featureStatsDesc")}</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Beerdex — Twój osobisty piwny pamiętnik</p>
      </footer>
    </div>
  );
}

export default Landing;
