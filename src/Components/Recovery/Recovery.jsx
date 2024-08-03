import React from "react";
import styles from './Recovery.module.css';
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'



function Recovery(){

    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form}>
                <h3>Reset Password</h3>

                <label htmlFor="username">Username</label> <i aria-hidden="true" data-tooltip="If you've entered a correct username, you will recive an email with link to reset your password."><FontAwesomeIcon icon={faCircleQuestion}/></i>
                <input type="text" placeholder="Enter your Username" id="username"></input>
                <button className={styles.resetButton} type="button" onClick={() => toast.success('Reset link sent to your E-Mail')} >Reset Password</button>
            </form>
        </div>
    )
}

export default Recovery