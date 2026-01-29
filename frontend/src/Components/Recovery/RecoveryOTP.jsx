import React, { useEffect } from "react";
import styles from './Recovery.module.css';
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { useAuthStore } from "../../store/store";
import { generateOTP } from "../../helper/helper";
import { verifyOTP } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import LanguageSelector from "../LanguageSelector/LanguageSelector";


function RecoveryOTP(){
    const {t} = useTranslation();
    const { username } = useAuthStore(state => state.auth);
    useEffect(() => {
        if(!username) return navigate('/recovery');
    });
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues : {
            OTP : ''
        },
        onSubmit : async values => {
            let verifyPromise = verifyOTP({username: username, code: values.OTP})
            toast.promise(verifyPromise, {
                loading: t('toastLoadingVerify'),
                success : t('toastSuccessVerify'),
                error : t('toastErrorVerify')
            });
            verifyPromise.then(function(){navigate('/reset')})
        }
    });

    function resend(){
        let generateOtpPromise = generateOTP(username);
        toast.promise(generateOtpPromise, {
            loading: t('toastLoadingEmail'),
            success : t('toastSuccessEmail'),
            error : t('toastErrorEmail')
        });
    }

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <LanguageSelector></LanguageSelector>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>{t('passwordRecovery')}</h3>

                <label htmlFor="OTP">{t('verifyCode')}</label>
                <input {...formik.getFieldProps('OTP')} type="text" placeholder={t('enterVerifyCode')} id="OTP"></input>
                <button className={styles.verifyButton} type="submit" >{t('verify')}</button>
                <p className={styles.resend}>{t('didntReceive')} <a onClick={resend}>{t('resend')}</a></p>
            </form>
        </div>
    )
}

export default RecoveryOTP