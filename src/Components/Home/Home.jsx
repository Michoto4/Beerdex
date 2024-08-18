import React, { useState, useEffect } from "react";
import styles from './Home.module.css';
import '../../App.css';
import avatar from '../../assets/default.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../../helper/convert';
import useFetch from '../../hooks/fetch.hook';
import { updateUser } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';

function Home(){

    const [file, setFile] = useState();
    const [{ isLoading, apiData, serverError }] = useFetch()
    const navigate = useNavigate()

    // check if user is logged in (by checking if there is a jwt token saved in your browser's local storage)
    // if isn't then block access by navigating to '/' page
    let checkToken = localStorage.getItem('token');
    if(!checkToken){
        useEffect(() => {
            navigate('/');
        });
    }


    const formik = useFormik({
        initialValues : {
            profile: ''
        },
        onSubmit : async values => {
            values = await Object.assign(values, {profile: file || ''})

            let updatePromise = updateUser(values)
            toast.promise(updatePromise, {
                loading: 'Updating...',
                success : 'Update Successfull!',
                error : 'Could not update your profile.'
            })
        }
    });


      /** use this to convert uploaded photo to base64 */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
        
    }

  // logout handler function
    function userLogout(){
        localStorage.removeItem('token');
        navigate('/')
    }


    return(
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form} onSubmit={formik.handleSubmit}>
                <h3>Welcome to Beerdex, <b>{apiData?.username}</b></h3>

                <div className={styles.profileContainer}>
                    <label htmlFor="profile">
                        <img src={file || apiData?.profile || avatar} className={styles.profilePhoto} alt="avatar" />
                    </label>
                    
                    <input onChange={onUpload} type="file" id='profile' name='profile' />
                </div>
                <button className={styles.submitUpdate} type="submit">SAVE CHANGES</button><br />
                <button className={styles.logOutButton} onClick={userLogout}>LOG OUT</button>
            </form>
        </div>

    )
}

export default Home