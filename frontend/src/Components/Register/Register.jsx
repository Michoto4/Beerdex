import React from "react";
import styles from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../../helper/validate";
import { registerUser } from "../../helper/helper";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      delete values.passwordConfirm;
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: "Register Successfull!",
        error: "Could not Register.",
      });

      registerPromise.then(function () {
        navigate("/");
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

        <label htmlFor="email">E-Mail</label>
        <input
          {...formik.getFieldProps("email")}
          type="text"
          placeholder="E-mail"
          id="email"
        ></input>

        <label htmlFor="password">{t("password")}</label>
        <input
          {...formik.getFieldProps("password")}
          type="password"
          placeholder={t("password")}
          id="password"
        ></input>

        <label htmlFor="passwordConfirm">{t("confirmPassword")}</label>
        <input
          {...formik.getFieldProps("passwordConfirm")}
          type="password"
          placeholder={t("confirmPassword")}
          id="passwordConfirm"
        ></input>
        <button className={styles.registerButton} type="submit">
          {t("register")}
        </button>
        <p>
          {t("alreadyHave")} <a href="/">{t("login")}</a>
        </p>
      </form>
    </div>
  );
}

export default Register;

