import React, { useState } from "react";
import styles from "./BeerCard.module.scss";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function BeerCard({
  beerName,
  beerVariant,
  beerDescription,
  beerRating,
  beerPhoto,
  beerDate,
  onEdit,
  style,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isLongDescription = (beerDescription || "").length > 90;

  return (
    <div className={styles.beerCard} style={style}>
      <div className={styles.imageWrapper}>
        {beerPhoto && !imgError ? (
          <img
            className={styles.beerImg}
            src={beerPhoto}
            alt={beerName}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.placeholderIcon}>🍺</span>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.titleArea}>
            <h3 className={styles.beerTitle}>{beerName}</h3>
            <div className={styles.beerVariant}>{beerVariant}</div>
          </div>
          <div className={styles.ratingPill}>
            <span>⭐</span>
            <span>{beerRating}/10</span>
          </div>
        </div>

        {beerDate && <div className={styles.metaDate}>📅 {beerDate}</div>}

        <p
          className={`${styles.descriptionBox} ${
            !isExpanded && isLongDescription ? styles.clamped : ""
          }`}
        >
          {beerDescription}
        </p>

        {isLongDescription && (
          <button
            type="button"
            className={styles.toggleTextBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        )}

        <div className={styles.cardFooter}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEdit}
            title={t("editBeerTitle")}
            aria-label={t("editBeerTitle")}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            <span className={styles.editBtnText}>{t("edit")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeerCard;
