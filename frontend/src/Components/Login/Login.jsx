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
      <LanguageSelector></LanguageSelector>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <h3>Beerdex</h3>

        <label htmlFor="username">{t("username")}</label>
        <input
          {...formik.getFieldProps("username")}
          type="text"
          placeholder={t("username")}
          id="username"
        ></input>

        <label htmlFor="password">{t("password")}</label>
        <input
          {...formik.getFieldProps("password")}
          type="password"
          placeholder={t("password")}
          id="password"
        ></input>
        <button className={styles.loginButton} type="submit">
          {t("login")}
        </button>
        <Link to={"/register"}>
          <button className={styles.registerButton}>{t("register")}</button>
        </Link>
        <p>
          {t("forgot")} <a href="/recovery">{t("recover")}</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
