import React, { useState } from "react";
import styles from './Home.module.css';
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../../assets/default.jpg';
import BeerCard from './BeerCard.jsx';
import BeerPopup from "./BeerPopup.jsx";

// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function Home() {

    const [buttonPopup, setButtonPopup] = useState(false);

  return (
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <form className={styles.form}>
                <div className={styles.topBar}>
                    <h1>BEERDEX</h1>
                    <h3>Your beer pokedex</h3>
                    <div className={styles.profileContainer}>
                        <label htmlFor="profile">
                            <img src={avatar} alt="avatar" />
                        </label>
                    </div>
                </div>
                <hr />
                <input className={styles.beerBrowseInput} type="text" placeholder="Search for a Beer" />
                <div className={styles.appContainer}>
                    <BeerCard></BeerCard>
                    <BeerCard></BeerCard>
                    <BeerCard></BeerCard>
                    <BeerCard></BeerCard>
                    <BeerCard></BeerCard>
                    <BeerCard></BeerCard>
                </div>
                <button type="button" className={styles.addBeer} onClick={() => setButtonPopup(true)}><FontAwesomeIcon icon={faPlus} /></button>
                <BeerPopup trigger={buttonPopup} setTrigger={setButtonPopup}></BeerPopup>
            </form>
        </div>
  )
}

export default Home