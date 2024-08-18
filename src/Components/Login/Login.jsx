import React from "react";
import styles from './Login.module.css';
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { loginValidate } from "../../helper/validate";
import { loginUser } from "../../helper/helper";

function Login(){

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues : {
            username : '',
            password : ''
        },
        validate : loginValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {                                                           
            let loginPromise = loginUser({username: values.username, password: values.password});
            toast.promise(loginPromise, {
                loading: 'Logging in...',
                success : 'Login Successfull!',
                error : 'Invalid username or password.'
            });
            loginPromise.then(res => {
                let {token} = res.data;
                localStorage.setItem('token', token);
                navigate('/home');
            })
        }
    });

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Beerdex</h3>

                <label htmlFor="username">Username</label>
                <input {...formik.getFieldProps('username')} type="text" placeholder="Username" id="username"></input>

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