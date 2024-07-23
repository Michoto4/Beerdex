import React from "react";
import styles from './Login.module.scss';
import { Link } from "react-router-dom";

function Login(){

    return(
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.shape}></div>
                <div className={styles.shape}></div>
            </div>
            <form className={styles.form}>
                <h3>Beerdex</h3>

                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" id="username"></input>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" id="password"></input>

                <Link to={'/dashboard'}><button className={styles.loginButton}>Log In</button></Link>
                <Link to={'/register'}><button className={styles.registerButton}>Register</button></Link>
            </form>
        </div>
    )
}

export default Login