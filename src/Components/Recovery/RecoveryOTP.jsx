import React, { useEffect } from "react";
import styles from './Recovery.module.css';
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { useAuthStore } from "../../store/store";
import { generateOTP } from "../../helper/helper";
import { verifyOTP } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';



function RecoveryOTP(){
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
                loading: 'Verifying...',
                success : 'Verify Successfull.',
                error : 'Invalid code!'
            });
            verifyPromise.then(function(){navigate('/reset')})
        }
    });

    function resend(){
        let generateOtpPromise = generateOTP(username);
        toast.promise(generateOtpPromise, {
            loading: 'Sending...',
            success : 'Email Sent',
            error : 'Invalid username.'
        });
    }

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Password Recovery</h3>

                <label htmlFor="OTP">Verify Code</label>
                <input {...formik.getFieldProps('OTP')} type="text" placeholder="Enter your Code" id="OTP"></input>
                <button className={styles.verifyButton} type="submit" >Verify</button>
                <p className={styles.resend}>Didn't recive email? <a onClick={resend}>Resend</a></p>
            </form>
        </div>
    )
}

export default RecoveryOTP