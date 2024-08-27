import React, { useState } from "react";
import styles from './Home.module.css';
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '../../helper/convert';
import { updateUser } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/fetch.hook';
import fetchBeers from "../../hooks/fetchBeers.hook.js";
import avatar from '../../assets/default.jpg';
import BeerCard from './BeerCard.jsx';
import BeerPopup from "./BeerPopup.jsx";

// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function Home() {
    const [file, setFile] = useState(); // set uploaded avatar to 'file'
    const [{ isLoading, apiData, serverError }] = useFetch() // fetch user data from database
    const [{ beerData }] = fetchBeers()
    console.log(beerData)
    const navigate = useNavigate()
    const [buttonPopup, setButtonPopup] = useState(false);

    // avatar update handler function
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
        let values = {profile: base64 || ''}
        let updatePromise = updateUser(values)
        toast.promise(updatePromise, {
            loading: 'Updating...',
            success : 'Update Successfull!',
            error : 'Could not update your profile.'
        })
    }

    // logout handler function
    function userLogout(){
        localStorage.removeItem('token');
        navigate('/')
    }


  return (
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form}>
                <div className={styles.topBar}>
                    <h2>Welcome to Beerdex, <b>{apiData?.username || 'Unknown'}</b></h2>
                    <div className={styles.profileContainer}>
                        <button type="button" onClick={userLogout}>LOG OUT</button>
                        <label htmlFor="profile">
                            <img src={ file || apiData?.profile || avatar} alt="avatar" />
                        </label>
                        <input onChange={onUpload} type="file" id='profile' name='profile' />
                    </div>
                </div>
                <hr />
                <input className={styles.beerBrowseInput} type="text" placeholder="Search for a Beer" />
                <div className={styles.appContainer}>
                    {beerData?.map((beer) => (
                        <BeerCard beerName={beer.beerName} beerVariant={beer.beerVariant} beerDescription={beer.beerDescription} beerRating={beer.beerRating} beerPhoto={beer.beerPhoto} />
                    ))}
                </div>
                <button type="button" className={styles.addBeer} onClick={() => setButtonPopup(true)}><FontAwesomeIcon icon={faPlus} /></button>
                <BeerPopup trigger={buttonPopup} setTrigger={setButtonPopup}></BeerPopup>
            </form>
        </div>
  )
}

export default Home