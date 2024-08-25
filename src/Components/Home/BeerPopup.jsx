import React from 'react'
import styles from './Home.module.css';
import addBeerDefault from '../../assets/addBeerDefault.png'
import beerDefault from '../../assets/beerDefault.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function BeerPopup(props) {
  return (props.trigger) ? (
    <div className={styles.popupBackground}>
        <div className={styles.popupContainer}>
            <div className={styles.topPart}>
                <h2>Add a Beer</h2>
                <button className={styles.closePopup} type='button' onClick={() => props.setTrigger(false)}><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <hr />
            <div className={styles.middlePart}>
                {/* BEER NAME */}
                <div className={styles.beerNameContainer}>
                    <label htmlFor="beerName">Beer Name</label><br />
                    <input type="text" placeholder="eg. Perła" id="beerName"></input>
                </div>

                {/* BEER VARIANT */}
                <div className={styles.beerVariantContainer}>
                    <label htmlFor="beerVariant">Beer Variant</label><br />
                    <input type="text" placeholder="eg. Export" id="beerVariant"></input>
                </div>

                {/* BEER DESCRIPTION */}
                <div className={styles.beerDescContainer}>
                    <label htmlFor="beerDesc">Beer Description</label><br />
                    <textarea name="beerDesc" id="beerDesc" placeholder="eg. Best beer ever."></textarea>
                </div>

                {/* BEER PHOTO */}
                <div className={styles.beerPhotoContainer}>
                    <label htmlFor="beerPhoto">
                        <img src={beerDefault} alt="Beer Photo" />
                    </label>
                    
                    <input type="file" id='beerPhoto' name='beerPhoto' />
                </div>

                {/* BEER RATING */}
                <div className={styles.beerRatingContainer}>
                    <label htmlFor="beerRating">Beer Rating</label><br />
                    <input type="number" placeholder="0" id="beerRating" min={0} max={10}></input><p>/10</p>
                </div>
            </div>
            <div className={styles.bottomPart}>
                <button type='button' className={styles.beerCancelButton} onClick={() => props.setTrigger(false)}>Cancel</button>
                <button type='button' className={styles.beerCreateButton}>Create</button>
            </div>
            { props.children }
        </div>
    </div>
  ) : "";
}

export default BeerPopup