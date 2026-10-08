import React, { useState, useCallback, useEffect } from "react";
import styles from "./BeerBottomSheet.module.scss";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import Cropper from "react-easy-crop";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import useFetch from "../../hooks/fetch.hook";
import { addBeer, updateBeer, removeBeer, getUsername } from "../../helper/helper";
import { addBeerValidate } from "../../helper/validate";
import { getCroppedImg } from "../../helper/cropImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function BeerBottomSheet({
  isOpen,
  onClose,
  beer = null,
  onBeerAdded,
  onBeerUpdated,
  onBeerDeleted,
}) {
  const { t } = useTranslation();
  const [{ apiData }] = useFetch();
  const isEditMode = Boolean(beer);

  // Cropper & photo states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  // Synchronize state when sheet opens or beer changes
  useEffect(() => {
    if (isOpen) {
      if (beer) {
        setFinalImage(beer.beerPhoto || null);
        setImageSrc(null);
        setIsCropping(false);
      } else {
        setFinalImage(null);
        setImageSrc(null);
        setIsCropping(false);
      }
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [isOpen, beer]);

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

  const handleCancelCrop = () => {
    setIsCropping(false);
    // If we already had a photo before, keep it; otherwise reset imageSrc
    if (!finalImage) {
      setImageSrc(null);
    }
  };

  const handleRemovePhoto = () => {
    setFinalImage("");
    setImageSrc(null);
    setIsCropping(false);
  };

  const resetAll = () => {
    setImageSrc(null);
    setFinalImage(null);
    setIsCropping(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      beerName: beer?.beerName || "",
      beerVariant: beer?.beerVariant || "",
      beerRating:
        beer?.beerRating !== undefined && beer?.beerRating !== null
          ? String(beer.beerRating)
          : "7",
      beerDescription: beer?.beerDescription || "",
      beerDate: beer?.beerDate || "",
    },
    validate: (values) => {
      const errors = addBeerValidate(values) || {};
      if (!values.beerName || !values.beerName.trim()) {
        errors.beerName = t("beerName");
      }
      if (!values.beerVariant || !values.beerVariant.trim()) {
        errors.beerVariant = t("beerVariant");
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!values.beerName?.trim() || !values.beerVariant?.trim()) {
          toast.error(t("toastErrorBeer"));
          return;
        }

        if (isEditMode) {
          const payload = {
            beerId: beer._id,
            _id: beer._id,
            beerName: values.beerName.trim(),
            beerVariant: values.beerVariant.trim(),
            beerRating: values.beerRating,
            beerDescription: values.beerDescription,
            beerPhoto: finalImage !== null ? finalImage : beer.beerPhoto || "",
            beerDate: values.beerDate || beer.beerDate,
          };

          const updatePromise = updateBeer(payload);
          const response = await toast.promise(updatePromise, {
            loading: t("toastLoadingBeerUpdate"),
            success: t("toastSuccessBeerUpdate"),
            error: t("toastErrorBeerUpdate"),
          });

          if (response.status === 200) {
            resetForm();
            resetAll();
            if (onBeerUpdated) onBeerUpdated(response.data?.beer || payload);
            onClose();
          }
        } else {
          const payload = {
            beerName: values.beerName.trim(),
            beerVariant: values.beerVariant.trim(),
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
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleDeleteBeer = async () => {
    if (!beer || !window.confirm(t("confirmDelete"))) {
      return;
    }

    try {
      const user = await getUsername();
      const username = user?.username || apiData?.username;

      const deletePromise = removeBeer({
        beerId: beer._id,
        _id: beer._id,
        beerName: beer.beerName,
        beerVariant: beer.beerVariant,
        beerOwner: username,
      });

      await toast.promise(deletePromise, {
        loading: t("toastLoadingBeerRemove"),
        success: t("toastSuccessBeerRemove"),
        error: t("toastErrorBeerRemove"),
      });

      if (onBeerDeleted) {
        onBeerDeleted(beer._id);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("toastErrorBeerRemove"));
    }
  };

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
          <h2>{isEditMode ? t("editBeerTitle") : t("addBeerTitle")}</h2>
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

            <div
              className={
                isEditMode
                  ? styles.inputGroup
                  : `${styles.inputGroup} ${styles.fullWidth}`
              }
            >
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

            {isEditMode && (
              <div className={styles.inputGroup}>
                <label htmlFor="beerDate">{t("beerDateEdit")}</label>
                <input
                  id="beerDate"
                  type="text"
                  placeholder="DD.MM.YYYY"
                  {...formik.getFieldProps("beerDate")}
                />
              </div>
            )}

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
              <span>
                📸{" "}
                {finalImage
                  ? isEditMode
                    ? t("currentPhoto")
                    : t("takeOrSelectPhoto")
                  : t("takeOrSelectPhoto")}
              </span>
            </div>

            {isCropping ? (
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
                  <div className={styles.cropButtonsRow}>
                    <button
                      type="button"
                      className={styles.cancelCropBtn}
                      onClick={handleCancelCrop}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      className={styles.confirmCropBtn}
                      onClick={handleConfirmCrop}
                    >
                      ✓ {t("recropPhoto")}
                    </button>
                  </div>
                </div>
              </>
            ) : finalImage ? (
              <div className={styles.croppedPreview}>
                <img src={finalImage} alt="Beer Preview" />
                <div className={styles.previewActions}>
                  {imageSrc && (
                    <button
                      type="button"
                      className={styles.reCropBtn}
                      onClick={() => setIsCropping(true)}
                    >
                      ✂️ {t("recropPhoto")}
                    </button>
                  )}
                  <label className={styles.reCropBtn}>
                    🔄 {t("changePhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <button
                    type="button"
                    className={`${styles.reCropBtn} ${styles.dangerBtn}`}
                    onClick={handleRemovePhoto}
                  >
                    🗑️ {t("removePhoto")}
                  </button>
                </div>
              </div>
            ) : (
              <label className={styles.uploadTrigger}>
                <span>📷 {t("takeOrSelectPhoto")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </form>

        <div className={styles.sheetFooter}>
          {isEditMode ? (
            <div className={styles.editFooterLayout}>
              <button
                type="button"
                className={styles.deleteSheetBtn}
                onClick={handleDeleteBeer}
                title={t("deleteBeer")}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>{t("deleteBeer")}</span>
              </button>

              <div className={styles.actionGroup}>
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
                  💾 {t("saveChanges")}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.addFooterLayout}>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default BeerBottomSheet;
