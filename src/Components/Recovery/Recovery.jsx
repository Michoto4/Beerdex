import React, { useEffect } from "react";
import styles from './Recovery.module.css';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { generateOTP } from "../../helper/helper";
import { useFormik } from "formik";
import { useAuthStore } from "../../store/store";


// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'



function Recovery(){
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
                loading: 'Sending...',
                success : 'Email Sent',
                error : 'Invalid username.'
            });
            generateOtpPromise.then(OTP => {
                if(OTP){
                    setUsername(username);
                    return navigate('/recoveryOTP');
                }
                return toast.error('Something went wrong 🤕');
            })
        }
    });
    
    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Password Recovery</h3>

                <label  htmlFor="username">Username</label> <i aria-hidden="true" data-tooltip="If you enter correct username, you'll recive an email with Verification Code to reset your password."><FontAwesomeIcon icon={faCircleQuestion}/></i>
                <input {...formik.getFieldProps('username')} type="text" placeholder="Enter your Username" id="username"></input>
                <button className={styles.resetButton} type="submit">Send Email</button>
            </form>
        </div>
    )
}

export default Recovery