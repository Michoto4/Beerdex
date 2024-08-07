import React, { useState } from "react";
import styles from './Home.module.css';
import '../../App.css';
import avatar from '../../assets/default.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../../helper/convert';
import useFetch from '../../hooks/fetch.hook';
import { updateUser } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/store";

function Home(){

    const [file, setFile] = useState();
    const [{ isLoading, apiData, serverError }] = useFetch();
    const navigate = useNavigate()

    const { username } = useAuthStore(state => state.auth);


      /** use this to conver uploaded photo to base64 */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

  // logout handler function
    function userLogout(){
        localStorage.removeItem('token');
        navigate('/')
    }


    return(
        // <div className={styles.container}>
        //     <h1>Home Page</h1><br />
        //     <h3>Welcome to Beerdex, <b>{username}</b></h3><br /><hr />
        //         <div className={styles.profileContainer}>
        //             <label htmlFor="profile">
        //                 <img src={file || avatar} className={styles.profilePhoto} alt="avatar" />
        //             </label>
                    
        //             <input onChange={onUpload} type="file" id='profile' name='profile' />
        //         </div>
        //       <button className={styles.logOutButton} onClick={userLogout}>Log Out</button>
        // </div>


        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form}>
                <h3>Welcome to Beerdex, <b>{username}</b></h3>

                <div className={styles.profileContainer}>
                    <label htmlFor="profile">
                        <img src={file || avatar} className={styles.profilePhoto} alt="avatar" />
                    </label>
                    
                    <input onChange={onUpload} type="file" id='profile' name='profile' />
                </div>
                
                <button className={styles.logOutButton} onClick={userLogout}>LOG OUT</button>
            </form>
        </div>

    )
}

export default Home