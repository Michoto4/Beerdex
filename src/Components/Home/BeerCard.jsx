import React from 'react'
import styles from './Home.module.css';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';

// <BeerCard beerName={beer.beerName} beerVariant={beer.beerVariant} beerDescription={beer.beerDescription} beerRating={beer.beerRating} beerPhoto={beer.beerPhoto} />
function BeerCard({beerName, beerVariant, beerDescription, beerRating, beerPhoto}) {
    // get current date
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}.${month}.${year}`;

    const { t } = useTranslation();

  return (
    <div className={styles.beerContainer}>
        <div className={styles.beerImage}>
            <label htmlFor="beerImage">
                <img src={beerPhoto} alt="beerImage" />
            </label>
        </div>
        <div className={styles.middleContainer}>
            <h2>{beerName}</h2>
            <h4>{beerVariant}</h4>
            <hr />
            <p>{beerDescription}</p>
        </div>
        <div className={styles.rightContainer}>
            <h5>{t('rating')}</h5>
            <p>{beerRating}/10</p>
            <h5>{t('date')}</h5>
            <p>{currentDate}</p>
        </div>
    </div>
  )
}

export default BeerCard