import React from "react";
import styles from './Register.module.css';
import { Link } from "react-router-dom";

function Register(){

    return(
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>
            <form className={styles.form}>
                <h3>Beerdex</h3>

                <label htmlFor="mail">E-Mail</label>
                <input type="email" placeholder="E-mail" id="mail"></input>

                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" id="username"></input>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" id="password"></input>

                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input type="password" placeholder="Confirm Password" id="passwordConfirm"></input>

                <Link to={'/dashboard'}><button className={styles.registerButton}>Register</button></Link>
                <p>Already have an account? <a href="/">Log In</a></p>
            </form>
        </div>
    )
}

export default Register