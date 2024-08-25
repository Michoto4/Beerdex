import React from 'react'
import beerDefault from '../../assets/beerDefault.jpg'
import styles from './Home.module.css';

function BeerCard() {
  return (
    <div className={styles.beerContainer}>
        <div className={styles.beerImage}>
            <label htmlFor="beerImage">
                <img src={beerDefault} alt="beerImage" />
            </label>
        </div>
        <div className={styles.middleContainer}>
            <h2>Example Beer Name</h2>
            <h4>Example Beer Type/Taste</h4>
            <hr />
            <p>This is an example description of a beer that you would add here to describe your beer.</p>
        </div>
        <div className={styles.rightContainer}>
            <h5>Rating:</h5>
            <p>5/10</p>
            <h5>Date Added:</h5>
            <p>25.08.2024</p>
        </div>
    </div>
  )
}

export default BeerCard