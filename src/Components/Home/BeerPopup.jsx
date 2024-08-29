import React, { useState, useEffect } from "react";
import styles from './Home.module.css';
import '../../App.css';
import avatar from '../../assets/default.jpg';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import useFetch from '../../hooks/fetch.hook';
import addBeerDefault from '../../assets/addBeerDefault.png'
import convertToBase64 from '../../helper/convert';
import { addBeer } from "../../helper/helper";
import { addBeerValidate } from "../../helper/validate";
import { useTranslation } from "react-i18next";
import '../../translation/i18n';

// import fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function BeerPopup(props) {
    const { t } = useTranslation();
    const [file, setFile] = useState();
    const [{ isLoading, apiData, serverError }] = useFetch()

    const formik = useFormik({
        initialValues : {
            beerOwner: '',
            beerName: '',
            beerVariant: '',
            beerDescription: '',
            beerRating: '',
            beerPhoto: file || ''
        },
        validate : addBeerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            values = await Object.assign(values, {beerPhoto: file || ''});
            values = await Object.assign(values, {beerOwner: apiData?.username || ''});
            let addBeerPromise = addBeer(values);
            const response = await toast.promise(addBeerPromise, {
                loading: t('toastLoadingBeer'),
                success : t('toastSuccessBeer'),
                error : t('toastErrorBeer')
            });
            if(response.status === 201){
                props.setTrigger(false);
                formik.resetForm();
            }
        }
    });


    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
    }
    

  return (props.trigger) ? (
    <div className={styles.popupBackground} >
        <div className={styles.popupContainer} onSubmit={(ev) => ev.target.reset()}>
            <div className={styles.topPart}>
                <h2>{t('addBeer')}</h2>
                <button className={styles.closePopup} type='button' onClick={() => props.setTrigger(false)}><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <hr />
            <div className={styles.middlePart}>
                {/* BEER NAME */}
                <div className={styles.beerNameContainer}>
                    <label htmlFor="beerName">{t('beerName')}</label><br />
                    <input {...formik.getFieldProps('beerName')} type="text" placeholder={t('exampleName')} id="beerName"></input>
                </div>

                {/* BEER VARIANT */}
                <div className={styles.beerVariantContainer}>
                    <label htmlFor="beerVariant">{t('beerVariant')}</label><br />
                    <input {...formik.getFieldProps('beerVariant')} type="text" placeholder={t('exampleVariant')} id="beerVariant"></input>
                </div>

                {/* BEER DESCRIPTION */}
                <div className={styles.beerDescContainer}>
                    <label htmlFor="beerDescription">{t('beerDesc')}</label><br />
                    <textarea {...formik.getFieldProps('beerDescription')} name="beerDescription" id="beerDescription" placeholder={t('exampleDesc')}></textarea>
                </div>

                {/* BEER PHOTO */}
                <div className={styles.beerPhotoContainer}>
                    <label htmlFor="beerPhoto">
                        <img src={file || addBeerDefault} alt="Beer Photo" />
                    </label>
                    
                    <input onChange={onUpload} type="file" id='beerPhoto' name='beerPhoto' />
                </div>

                {/* BEER RATING */}
                <div className={styles.beerRatingContainer}>
                    <label htmlFor="beerRating">{t('beerRating')}</label><br />
                    <input {...formik.getFieldProps('beerRating')} type="number" placeholder="0" id="beerRating" min={0} max={10}></input><p>/10</p>
                </div>
            </div>
            <div className={styles.bottomPart}>
                <button type='button' className={styles.beerCancelButton} onClick={() => props.setTrigger(false)}>{t('cancel')}</button>
                <button type='button' onClick={() => formik.handleSubmit()} className={styles.beerCreateButton}>{t('create')}</button>
            </div>
            { props.children }
        </div>
    </div>
  ) : "";
}

export default BeerPopup