import React from "react";
import styles from './Register.module.css';
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../../helper/validate";

function Register(){

    const formik = useFormik({
        initialValues : {
            username : '',
            mail : '',
            password : '',
            passwordConfirm : ''
        },
        validate : registerValidate,
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
                <h3>Beerdex</h3>

                <label htmlFor="username">Username</label>
                <input {...formik.getFieldProps('username')} type="text" placeholder="Username" id="username"></input>

                <label htmlFor="mail">E-Mail</label>
                <input {...formik.getFieldProps('mail')} type="email" placeholder="E-mail" id="mail"></input>

                <label htmlFor="password">Password</label>
                <input {...formik.getFieldProps('password')} type="password" placeholder="Password" id="password"></input>

                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input {...formik.getFieldProps('passwordConfirm')} type="password" placeholder="Confirm Password" id="passwordConfirm"></input>
                <button className={styles.registerButton} type="submit">Register</button>
                {/* <Link to={'/home'}><button className={styles.registerButton}>Register</button></Link> */}
                <p>Already have an account? <a href="/">Log In</a></p>
            </form>
        </div>
    )
}

export default Register