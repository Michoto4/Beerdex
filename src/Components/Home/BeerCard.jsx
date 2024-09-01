import React from 'react'
import styles from './Home.module.css';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import { removeBeer, getUsername } from '../../helper/helper';

// import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

// <BeerCard beerName={beer.beerName} beerVariant={beer.beerVariant} beerDescription={beer.beerDescription} beerRating={beer.beerRating} beerPhoto={beer.beerPhoto} />
function BeerCard({beerName, beerVariant, beerDescription, beerRating, beerPhoto, beerDate}) {

    const { t } = useTranslation();

    async function handleRemove(e){
        e.preventDefault();
        const beerNameRemove = e.target.parentElement.previousElementSibling.firstElementChild.textContent;
        const beerVariantRemove = e.target.parentElement.previousElementSibling.children[1].textContent;
        const getUsernamePromise = await getUsername();
        const { username } = getUsernamePromise;
        // const credentials = {beerName: beerNameRemove, beerVariant: beerVariantRemove, beerOwner: username};
        let beerName = beerNameRemove;
        let beerVariant = beerVariantRemove;
        let beerOwner = username;
        let removePromise = removeBeer({beerName, beerVariant, beerOwner});
        toast.promise(removePromise, {
            loading: t('toastLoadingBeerRemove'),
            success : t('toastSuccessBeerRemove'),
            error : t('toastErrorBeerRemove')
        });
    }

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
            <p>{beerDate}</p>
            <button onClick={handleRemove}><FontAwesomeIcon icon={faTrashCan} /></button>
        </div>
    </div>
  )
}

export default BeerCard