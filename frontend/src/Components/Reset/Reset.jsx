import React, { useEffect } from "react";
import styles from './Reset.module.css';
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { resetValidate } from "../../helper/validate";
import { resetPassword } from "../../helper/helper";
import { useAuthStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import LanguageSelector from "../LanguageSelector/LanguageSelector";

function Reset(){
    const {t} = useTranslation();
    const { username } = useAuthStore(state => state.auth)
    const navigate = useNavigate();

    useEffect(() => {
        if(!username) return navigate('/');
    });

    const formik = useFormik({
        initialValues : {
            password : '',
            passwordConfirm : ''
        },
        validate : resetValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            let resetPromise = resetPassword({ username, password: values.password })
            toast.promise(resetPromise, {
                loading: t('toastLoadingReset'),
                success : t('toastSuccessReset'),
                error : t('toastErrorReset')
            });
            resetPromise.then(function(){navigate('/login')});
        }
    });

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <LanguageSelector></LanguageSelector>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>{t('resetPassword')}</h3>

                <label htmlFor="password">{t('newPassword')}</label>
                <input {...formik.getFieldProps('password')} type="password" placeholder={t('newPassword')} id="password"></input>

                <label htmlFor="passwordConfirm">{t('confirmNewPassword')}</label>
                <input {...formik.getFieldProps('passwordConfirm')} type="password" placeholder={t('confirmNewPassword')} id="passwordConfirm"></input>
                <button className={styles.resetButton} type="submit">{t('resetPassword')}</button>
            </form>
        </div>
    )
}

export default Reset