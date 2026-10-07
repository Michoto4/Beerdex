import React, { useState, useMemo } from "react";
import styles from "./Profile.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "../../hooks/fetch.hook";
import useFetchBeers from "../../hooks/fetchBeers.hook";
import convertToBase64 from "../../helper/convert";
import { updateUser } from "../../helper/helper";
import defaultAvatar from "../../assets/default.jpg";

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [{ isLoading, apiData }] = useFetch();
  const [{ beerData }] = useFetchBeers();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const onUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    try {
      const base64 = await convertToBase64(e.target.files[0]);
      setAvatarPreview(base64);
      const updatePromise = updateUser({ profile: base64 || "" });
      toast.promise(updatePromise, {
        loading: t("toastLoadingUpdate"),
        success: t("toastSuccessUpdate"),
        error: t("toastErrorUpdate"),
      });
    } catch (err) {
      toast.error(t("toastErrorUpdate"));
    }
  };

  // Derive account creation date from MongoDB ObjectId
  const memberSince = useMemo(() => {
    if (apiData?.createdAt) {
      return new Date(apiData.createdAt).toLocaleDateString();
    }
    if (apiData?._id && typeof apiData._id === "string" && apiData._id.length >= 8) {
      const timestamp = parseInt(apiData._id.substring(0, 8), 16) * 1000;
      if (!isNaN(timestamp)) {
        return new Date(timestamp).toLocaleDateString();
      }
    }
    return t("unknown");
  }, [apiData, t]);

  // Compute stats from beers
  const stats = useMemo(() => {
    const list = beerData || [];
    if (!list.length) {
      return {
        total: 0,
        avg: "0.0",
        oldest: null,
        newest: null,
        highest: null,
        lowest: null,
        brandCounts: [],
        ratingDistribution: {},
      };
    }

    const total = list.length;
    let sumRating = 0;
    let highestBeer = list[0];
    let lowestBeer = list[0];

    const brandMap = {};
    const ratingDist = {};

    list.forEach((b) => {
      const ratingNum = parseFloat(b.beerRating) || 0;
      sumRating += ratingNum;

      if (ratingNum > (parseFloat(highestBeer.beerRating) || 0)) {
        highestBeer = b;
      }
      if (ratingNum < (parseFloat(lowestBeer.beerRating) || 10)) {
        lowestBeer = b;
      }

      // Brand count
      const brand = (b.beerName || "").trim();
      if (brand) {
        brandMap[brand] = (brandMap[brand] || 0) + 1;
      }

      // Rating distribution
      const rounded = Math.round(ratingNum);
      ratingDist[rounded] = (ratingDist[rounded] || 0) + 1;
    });

    const avg = (sumRating / total).toFixed(1);

    // Oldest and newest (list order or beerDate)
    const oldest = list[0];
    const newest = list[list.length - 1];

    const brandCounts = Object.entries(brandMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      avg,
      oldest,
      newest,
      highest: highestBeer,
      lowest: lowestBeer,
      brandCounts,
      ratingDistribution: ratingDist,
    };
  }, [beerData]);

  return (
    <div className={styles.profilePage}>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/home")}
          type="button"
        >
          ← {t("backToHome")}
        </button>
        <h1>{t("profile")}</h1>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarCol}>
          <img
            src={avatarPreview || apiData?.profile || defaultAvatar}
            alt="Profile Avatar"
            className={styles.avatarImg}
          />
          <label className={styles.changeAvatarLabel}>
            📷 {t("changeAvatar")}
            <input type="file" accept="image/*" onChange={onUpload} />
          </label>
        </div>

        <div className={styles.userInfoCol}>
          <div className={styles.username}>
            {apiData?.username || t("unknown")}
          </div>
          <div className={styles.memberSince}>
            {t("memberSince")} {memberSince}
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>📊 {t("accountStats")}</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t("totalBeers")}</span>
          <span className={styles.statValue}>🍺 {stats.total}</span>
          <span className={styles.statSub}>
            {stats.total > 0 ? "w Twojej kolekcji" : t("noBeersYet")}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t("avgRating")}</span>
          <span className={styles.statValue}>⭐ {stats.avg} / 10</span>
          <span className={styles.statSub}>Średnia wszystkich ocen</span>
        </div>

        {stats.highest && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("highestRatedBeer")}</span>
            <span className={styles.statValue}>
              🏆 {stats.highest.beerRating}/10
            </span>
            <span className={styles.statSub}>
              {stats.highest.beerName} ({stats.highest.beerVariant})
            </span>
          </div>
        )}

        {stats.lowest && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("lowestRatedBeer")}</span>
            <span className={styles.statValue}>
              🔻 {stats.lowest.beerRating}/10
            </span>
            <span className={styles.statSub}>
              {stats.lowest.beerName} ({stats.lowest.beerVariant})
            </span>
          </div>
        )}

        {stats.oldest && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("oldestBeer")}</span>
            <span className={styles.statValue}>
              ⏳ {stats.oldest.beerName}
            </span>
            <span className={styles.statSub}>
              {stats.oldest.beerDate || "Brak daty"}
            </span>
          </div>
        )}

        {stats.newest && (
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("newestBeer")}</span>
            <span className={styles.statValue}>
              🚀 {stats.newest.beerName}
            </span>
            <span className={styles.statSub}>
              {stats.newest.beerDate || "Brak daty"}
            </span>
          </div>
        )}
      </div>

      {stats.brandCounts.length > 0 && (
        <div className={styles.brandStatsSection}>
          <h3 className={styles.sectionTitle}>
            🏷️ Twoje marki (różne warianty)
          </h3>
          <div className={styles.brandList}>
            {stats.brandCounts.map((brand) => (
              <div key={brand.name} className={styles.brandBadge}>
                <span>{brand.name}</span>
                <span className={styles.brandCount}>{brand.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className={styles.ratingsBreakdown}>
          <h3 className={styles.sectionTitle}>
            ⭐ {t("ratingsDistribution")}
          </h3>
          <div className={styles.ratingBars}>
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => {
              const count = stats.ratingDistribution[score] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={score} className={styles.ratingBarRow}>
                  <span className={styles.starLabel}>⭐ {score}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={styles.countLabel}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
