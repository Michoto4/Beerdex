import React, { useState, useEffect } from "react";
import styles from './Home.module.css';
import '../../App.css';
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
            beerPhoto: file || '',
            beerVerticalStyle: '',
            beerHorizontalStyle: '',
            beerWidthStyle: ''
        },
        validate : addBeerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values => {
            values = await Object.assign(values, {beerPhoto: file || ''});
            values = await Object.assign(values, {beerOwner: apiData?.username});
            values = await Object.assign(values, {beerVerticalStyle: sliderValueVertical});
            values = await Object.assign(values, {beerHorizontalStyle: sliderValueHorizontal});
            values = await Object.assign(values, {beerWidthStyle: sliderValueWidth});
            let addBeerPromise = addBeer(values);
            const response = await toast.promise(addBeerPromise, {
                loading: t('toastLoadingBeer'),
                success : t('toastSuccessBeer'),
                error : t('toastErrorBeer')
            });
            if(response.status === 201){
                formik.resetForm();
                props.setTrigger(false);
            }
        }
    });


    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64)
    }
    
    const [sliderValueVertical, setSliderValueVertical] = useState(0);

    function sliderUpdateVertical(e){
        const sliderValueVertical = e.target.value
        setSliderValueVertical(sliderValueVertical);
    }

    const [sliderValueHorizontal, setSliderValueHorizontal] = useState(0);

    function sliderUpdateHorizontal(e){
        const sliderValueHorizontal = e.target.value
        setSliderValueHorizontal(sliderValueHorizontal);
    }

    const [sliderValueWidth, setSliderValueWidth] = useState(100);

    function sliderUpdateWidth(e){
        const sliderValueWidth = e.target.value
        setSliderValueWidth(sliderValueWidth);
    }


  return (props.trigger) ? (
    <div className={styles.popupBackground}>
        <form className={styles.popupContainer} onSubmit={(e) => {e.target.reset(); e.preventDefault();}}>
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
                        <img style={{bottom: `${sliderValueVertical}%`, left: `${sliderValueHorizontal}%`, width: `${sliderValueWidth}px`}} src={file || addBeerDefault} alt="Beer Photo" />
                    </label>
                    
                    <input onChange={onUpload} type="file" id='beerPhoto' name='beerPhoto' />
                </div>
                
                {/* BEER IMAGE POSITION VERTICAL */}
                <div className={styles.beerImageSliderContainerVertical}>
                    <input onChange={sliderUpdateVertical} type="range" min="-200" max="200" className={styles.sliderInputVertical}/>
                </div>
                {/* BEER IMAGE POSITION HORIZONTAL */}
                <div className={styles.beerImageSliderContainerHorizontal}>
                    <input onChange={sliderUpdateHorizontal} type="range" min="-200" max="200" className={styles.sliderInputHorizontal}/>
                    <input onChange={sliderUpdateWidth} type="range" min="100" max="500" className={styles.sliderInputWidth}/>
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
        </form>
    </div>
  ) : "";
}

export default BeerPopup