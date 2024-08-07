import React from "react";
import styles from './Register.module.css';
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../../helper/validate";
import { registerUser } from "../../helper/helper";

function Register(){

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues : {
            username : '',
            email : '',
            password : '',
            passwordConfirm : ''
        },
        validate : registerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            delete values.passwordConfirm;
            console.log(values)
            let registerPromise = registerUser(values)
            toast.promise(registerPromise, {
                loading: 'Creating...',
                success : 'Register Successfull!',
                error : 'Could not Register.'
            });

            registerPromise.then(function(){navigate('/')});
        }
    });

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Beerdex</h3>

                <label htmlFor="username">Username</label>
                <input {...formik.getFieldProps('username')} type="text" placeholder="Username" id="username"></input>

                <label htmlFor="email">E-Mail</label>
                <input {...formik.getFieldProps('email')} type="text" placeholder="E-mail" id="email"></input>

                <label htmlFor="password">Password</label>
                <input {...formik.getFieldProps('password')} type="password" placeholder="Password" id="password"></input>

                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input {...formik.getFieldProps('passwordConfirm')} type="password" placeholder="Confirm Password" id="passwordConfirm"></input>
                <button className={styles.registerButton} type="submit">Register</button>
                <p>Already have an account? <a href="/">Log In</a></p>
            </form>
        </div>
    )
}

export default Register