import React, { useEffect } from "react";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidate } from "../../helper/validate";
import { loginUser } from "../../helper/helper";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import logo from "../../assets/logo.png";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let checkToken = localStorage.getItem("token");
  if (checkToken) {
    useEffect(() => {
      navigate("/");
    });
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = loginUser({
        username: values.username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Logging in...",
        success: "Login Successfull!",
        error: "Invalid username or password.",
      });
      loginPromise.then((res) => {
        let { token } = res.data;
        localStorage.setItem("token", token);
        navigate("/home");
      });
    },
  });

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className={styles.topLangBar}>
        <LanguageSelector />
      </div>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.headerArea}>
          <img src={logo} alt="Beerdex" className={styles.logoImg} />
          <h3>Beerdex</h3>
          <p>{t("login")}</p>
        </div>

        <label htmlFor="username">{t("username")}</label>
        <input
          {...formik.getFieldProps("username")}
          type="text"
          placeholder={t("username")}
          id="username"
        />

        <label htmlFor="password">{t("password")}</label>
        <input
          {...formik.getFieldProps("password")}
          type="password"
          placeholder={t("password")}
          id="password"
        />

        <button className={styles.loginButton} type="submit">
          {t("login")}
        </button>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <button className={styles.registerButton} type="button">
            {t("register")}
          </button>
        </Link>

        <p className={styles.footerText}>
          {t("forgot")} <Link to="/recovery">{t("recover")}</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
