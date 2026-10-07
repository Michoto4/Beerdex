import React from "react";
import styles from "./Settings.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import useFetch from "../../hooks/fetch.hook";
import { changeUserPassword } from "../../helper/helper";
import { changePasswordValidate } from "../../helper/validate";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [{ isLoading, apiData }] = useFetch();

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: changePasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const promise = changeUserPassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        await toast.promise(promise, {
          loading: t("toastLoadingReset"),
          success: t("toastSuccessReset"),
          error: (err) => err?.response?.data?.error || t("toastErrorReset"),
        });

        resetForm();
      } catch (err) {
        // Handled in toast.promise
      }
    },
  });

  return (
    <div className={styles.settingsPage}>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/home")}
          type="button"
        >
          ← {t("backToHome")}
        </button>
        <h1>{t("settings")}</h1>
      </div>

      {/* Account Info Section */}
      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <span>👤</span>
          <h2>{t("accountData")}</h2>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label>{t("username")}</label>
            <span className={styles.badgeLocked}>🔒 {t("permanentField")}</span>
          </div>
          <input
            type="text"
            value={apiData?.username || ""}
            disabled
            readOnly
          />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label>E-Mail</label>
            <span className={styles.badgeLocked}>🔒 {t("permanentField")}</span>
          </div>
          <input
            type="email"
            value={apiData?.email || ""}
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Change Password Section */}
      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <span>🔑</span>
          <h2>{t("changePasswordTitle")}</h2>
        </div>

        <form onSubmit={passwordFormik.handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="currentPassword">{t("currentPassword")}</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...passwordFormik.getFieldProps("currentPassword")}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="newPassword">{t("newPassword")}</label>
            <input
              id="newPassword"
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              {...passwordFormik.getFieldProps("newPassword")}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword">{t("confirmNewPassword")}</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              {...passwordFormik.getFieldProps("confirmPassword")}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {t("savePassword")}
          </button>
        </form>
      </div>

      {/* Language Section */}
      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <span>🌐</span>
          <h2>{t("languageSection")}</h2>
        </div>
        <LanguageSelector />
      </div>
    </div>
  );
}

export default Settings;
