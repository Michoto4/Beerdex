import React, { useState, useCallback } from "react";
import styles from "./BeerBottomSheet.module.scss";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import Cropper from "react-easy-crop";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import useFetch from "../../hooks/fetch.hook";
import { addBeer } from "../../helper/helper";
import { addBeerValidate } from "../../helper/validate";
import { getCroppedImg } from "../../helper/cropImage";

function BeerBottomSheet({ isOpen, onClose, onBeerAdded }) {
  const { t } = useTranslation();
  const [{ apiData }] = useFetch();

  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setIsCropping(true);
        setFinalImage(null);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFinalImage(croppedImage);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
      toast.error(t("toastError"));
    }
  };

  const resetAll = () => {
    setImageSrc(null);
    setFinalImage(null);
    setIsCropping(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const formik = useFormik({
    initialValues: {
      beerName: "",
      beerVariant: "",
      beerRating: "7",
      beerDescription: "",
    },
    validate: addBeerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          beerName: values.beerName,
          beerVariant: values.beerVariant,
          beerRating: values.beerRating,
          beerDescription: values.beerDescription,
          beerPhoto: finalImage || imageSrc || "",
          beerOwner: apiData?.username,
          beerVerticalStyle: "0",
          beerHorizontalStyle: "0",
          beerWidthStyle: "100",
        };

        const addPromise = addBeer(payload);
        const response = await toast.promise(addPromise, {
          loading: t("toastLoadingBeer"),
          success: t("toastSuccessBeer"),
          error: t("toastErrorBeer"),
        });

        if (response.status === 201) {
          resetForm();
          resetAll();
          if (onBeerAdded) onBeerAdded();
          onClose();
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className={styles.sheetBackdrop} onClick={onClose}>
      <div
        className={styles.bottomSheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className={styles.dragHandleBar}>
          <div className={styles.dragHandle} />
        </div>

        <div className={styles.sheetHeader}>
          <h2>{t("addBeerTitle")}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.sheetBody}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="beerName">{t("beerName")} *</label>
              <input
                id="beerName"
                type="text"
                placeholder={t("exampleName")}
                {...formik.getFieldProps("beerName")}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="beerVariant">{t("beerVariant")} *</label>
              <input
                id="beerVariant"
                type="text"
                placeholder={t("exampleVariant")}
                {...formik.getFieldProps("beerVariant")}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label htmlFor="beerRating">{t("beerRating")} (0-10) *</label>
              <input
                id="beerRating"
                type="number"
                min="0"
                max="10"
                step="0.5"
                placeholder="10"
                {...formik.getFieldProps("beerRating")}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label htmlFor="beerDescription">{t("beerDesc")}</label>
              <textarea
                id="beerDescription"
                placeholder={t("exampleDesc")}
                {...formik.getFieldProps("beerDescription")}
              />
            </div>
          </div>

          {/* Interactive Photo & Crop Section */}
          <div className={styles.photoSection}>
            <div className={styles.photoLabelRow}>
              <span>📸 {t("takeOrSelectPhoto")}</span>
            </div>

            {!imageSrc ? (
              <label className={styles.uploadTrigger}>
                <span>📷 {t("takeOrSelectPhoto")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : isCropping ? (
              <>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  🖐️ {t("cropInstruction")}
                </p>
                <div className={styles.cropperContainer}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className={styles.cropControls}>
                  <div className={styles.zoomRow}>
                    <span>🔍 {t("zoomLabel")}</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.confirmCropBtn}
                    onClick={handleConfirmCrop}
                  >
                    ✓ Zatwierdź kadr
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.croppedPreview}>
                <img src={finalImage || imageSrc} alt="Beer Crop Preview" />
                <div>
                  <button
                    type="button"
                    className={styles.reCropBtn}
                    onClick={() => setIsCropping(true)}
                  >
                    ✂️ Dopasuj kadr
                  </button>
                  <label
                    className={styles.reCropBtn}
                    style={{ marginLeft: 8, display: "inline-block" }}
                  >
                    🔄 {t("changePhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className={styles.sheetFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => formik.handleSubmit()}
          >
            🍺 {t("saveBeer")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeerBottomSheet;
