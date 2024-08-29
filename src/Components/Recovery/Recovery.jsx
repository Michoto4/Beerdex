import React, { useEffect } from "react";
import styles from './Recovery.module.css';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { generateOTP } from "../../helper/helper";
import { useFormik } from "formik";
import { useAuthStore } from "../../store/store";
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import LanguageSelector from "../LanguageSelector/LanguageSelector";


// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'



function Recovery(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername);
    const formik = useFormik({
        initialValues : {
            username : ''
        },
        onSubmit : async values => {
            let username = values.username;
            let generateOtpPromise = generateOTP(username);
            toast.promise(generateOtpPromise, {
                loading: t('toastLoadingEmail'),
                success : t('toastSuccessEmail'),
                error : t('toastErrorEmail')
            });
            generateOtpPromise.then(OTP => {
                if(OTP){
                    setUsername(username);
                    return navigate('/recoveryOTP');
                }
                return toast.error(t('toastError'));
            })
        }
    });
    
    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <LanguageSelector></LanguageSelector>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>{t('passwordRecovery')}</h3>

                <label  htmlFor="username">{t('username')}</label> <i aria-hidden="true" data-tooltip={t('tooltip')}><FontAwesomeIcon icon={faCircleQuestion}/></i>
                <input {...formik.getFieldProps('username')} type="text" placeholder={t('enterUsername')} id="username"></input>
                <button className={styles.resetButton} type="submit">{t('sendMail')}</button>
            </form>
        </div>
    )
}

export default Recovery