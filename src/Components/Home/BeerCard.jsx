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
function BeerCard({beerName, beerVariant, beerDescription, beerRating, beerPhoto, beerDate, beerVerticalStyle, beerHorizontalStyle, beerWidthStyle}) {
    
    const { t } = useTranslation();

    async function handleRemove(e){
        const beerNameRemove = e.currentTarget.parentElement.children[1].firstChild.textContent;
        const beerVariantRemove = e.currentTarget.parentElement.children[1].firstChild.nextElementSibling.textContent;
        const getUsernamePromise = await getUsername();
        const { username } = getUsernamePromise;
        let removePromise = removeBeer({beerName: beerNameRemove, beerVariant: beerVariantRemove, beerOwner: username});
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
                <img style={{bottom: `${beerVerticalStyle}%`, left: `${beerHorizontalStyle}%`, width: `${beerWidthStyle}%`}} src={beerPhoto} alt="beerImage" />
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
        </div>
        <button type='button' onClick={handleRemove} ><FontAwesomeIcon icon={faTrashCan} /></button>
    </div>
  )
}

export default BeerCard