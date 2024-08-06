import React from "react";
import styles from './Login.module.css';
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidate } from "../../helper/validate";
import { useAuthStore } from "../../store/store";

function Login(){

    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername);

    const formik = useFormik({
        initialValues : {
            username : '',
            password : ''
        },
        validate : loginValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            setUsername(values.username)                                                            // tutaj musisz dorobic jeszcze hasło ale to bedzie w tym filmiku ogarniesz to a tera register robisz
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
                <p>Forgot password? <a href="/recovery">Recover Now</a></p>
            </form>
        </div>
    )
}

export default Login