import React, { useState, useEffect } from "react";
import styles from './Home.module.css';
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '../../helper/convert';
import { updateUser } from "../../helper/helper";
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/fetch.hook';
import useFetchBeers from "../../hooks/fetchBeers.hook.js";
import avatar from '../../assets/default.jpg';
import BeerCard from './BeerCard.jsx';
import BeerPopup from "./BeerPopup.jsx";
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import LanguageSelector from "../LanguageSelector/LanguageSelector";

// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function Home() {
    const { t } = useTranslation();
    const [file, setFile] = useState(); // set uploaded avatar to 'file'
    const [query, setQuery] = useState(); // set query for search beer in useFetchBeers hook
    const [{ isLoading, apiData, serverError }] = useFetch() // fetch user data from database
    const [{ beerData, beerIsLoading, beerServerError }] = useFetchBeers(query); // fetch user BEERS from database
    const navigate = useNavigate()
    const [buttonPopup, setButtonPopup] = useState(false);

    if (isLoading) {
        // kiedys tu zrobie kolko wczytywania czy cos takiego
    }

    // avatar update handler function
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
        let values = { profile: base64 || '' }
        let updatePromise = updateUser(values)
        toast.promise(updatePromise, {
            loading: t('toastLoadingUpdate'),
            success: t('toastSuccessUpdate'),
            error: t('toastErrorUpdate')
        })
    }

    async function submitSearchBeer(e) {
        if (e.key == "Enter") {
            const beerName = e.target.value;
            setQuery(beerName)
        }
    }

    // logout handler function
    function userLogout() {
        localStorage.removeItem('token');
        navigate('/')
    }

    // check if user is logged in (by checking if there is a jwt token saved in their browser's local storage)
    // if isn't then block access by navigating to '/' page
    let checkToken = localStorage.getItem('token');
    if (!checkToken) {
        useEffect(() => {
            navigate('/');
        });
    }

    // if fetch hook returns error because it didn't find the user in database - remove token and log them out
    if (serverError === "User doesn't exist") {
        localStorage.removeItem('token');
        navigate('/')
    }


    return (
        <div className={styles.container}>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <LanguageSelector></LanguageSelector>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.topBar}>
                    <h2>{t('welcome')} <b>{apiData?.username || t('unknown')}</b></h2>
                    <div className={styles.profileContainer}>
                        <button type="button" onClick={userLogout}>{t('logout')}</button>
                        <label htmlFor="profile">
                            <img src={file || apiData?.profile || avatar} alt="avatar" />
                        </label>
                        <input onChange={onUpload} type="file" id='profile' name='profile' />
                    </div>
                </div>
                <hr />
                <input className={styles.beerBrowseInput} type="text" placeholder={t('searchBeer')} onKeyDown={submitSearchBeer} />
                <div className={styles.appContainer}>
                    {beerData?.map((beer) => (
                            <BeerCard key={beer._id}
                                beerName={beer.beerName}
                                beerVariant={beer.beerVariant}
                                beerDescription={beer.beerDescription}
                                beerRating={beer.beerRating}
                                beerPhoto={beer.beerPhoto}
                                beerDate={beer.beerDate}
                                beerVerticalStyle={beer.beerVerticalStyle}
                                beerHorizontalStyle={beer.beerHorizontalStyle}
                                beerWidthStyle={beer.beerWidthStyle} />
                        ))}
                </div>
                <button type="button" className={styles.addBeer} onClick={() => setButtonPopup(true)}><FontAwesomeIcon icon={faPlus} /></button>
                <BeerPopup trigger={buttonPopup} setTrigger={setButtonPopup}></BeerPopup>
            </form>
        </div>
    )
}

export default Home