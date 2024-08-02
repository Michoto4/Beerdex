import React from "react";
import styles from './Login.module.css';
import { Link } from "react-router-dom";

function Login(){

    return(
        <div className={styles.container}>
            <form className={styles.form}>
                <h3>Beerdex</h3>

                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" id="username"></input>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" id="password"></input>

                <Link to={'/home'}><button className={styles.loginButton}>Log In</button></Link>
                <Link to={'/register'}><button className={styles.registerButton}>Register</button></Link>
            </form>
        </div>
    )
}

export default Login