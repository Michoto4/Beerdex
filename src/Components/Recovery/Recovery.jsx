import React from "react";
import styles from './Recovery.module.css';
import { Toaster, toast } from "react-hot-toast";


function Recovery(){

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form}>
                <h3>Reset Password</h3>

                <label htmlFor="E-Mail">E-Mail</label>
                <input type="text" placeholder="Enter your E-mail" id="E-Mail"></input>
                <button className={styles.resetButton} type="button" onClick={() => toast.success('Reset link sent to your E-Mail')} >Reset Password</button>
            </form>
        </div>
    )
}

export default Recovery