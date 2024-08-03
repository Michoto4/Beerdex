import React from "react";
import styles from './Reset.module.css';
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { resetValidate } from "../../helper/validate";


function Recovery(){

    const formik = useFormik({
        initialValues : {
            password : '',
            passwordConfirm : ''
        },
        validate : resetValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            console.log(values);
        }
    });

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Reset Password</h3>

                <label htmlFor="password">Password</label>
                <input {...formik.getFieldProps('password')} type="password" placeholder="Password" id="password"></input>

                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input {...formik.getFieldProps('passwordConfirm')} type="password" placeholder="Confirm Password" id="passwordConfirm"></input>
                <button className={styles.resetButton} type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default Recovery