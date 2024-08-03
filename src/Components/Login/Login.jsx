import React from "react";
import styles from './Login.module.css';
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidate } from "../../helper/validate";

function Login(){

    const formik = useFormik({
        initialValues : {
            username : '',
            password : ''
        },
        validate : loginValidate,
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

                <label htmlFor="username">Username or E-mail</label>
                <input {...formik.getFieldProps('username')} type="text" placeholder="Username or E-mail" id="username"></input>

                <label htmlFor="password">Password</label>
                <input {...formik.getFieldProps('password')} type="password" placeholder="Password" id="password"></input>
                <button className={styles.loginButton} type="submit">Log In</button>
                {/* <Link to={'/home'}><button className={styles.loginButton} type="submit">Log In</button></Link> */}
                <Link to={'/register'}><button className={styles.registerButton}>Register</button></Link>
                <p>Forgot password? <a href="/Recovery">Recover Now</a></p>
            </form>
        </div>
    )
}

export default Login