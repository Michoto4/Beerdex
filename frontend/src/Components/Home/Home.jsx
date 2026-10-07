import React, { useState, useEffect } from "react";
import styles from "./Home.module.scss";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/fetch.hook";
import useFetchBeers from "../../hooks/fetchBeers.hook";
import defaultAvatar from "../../assets/default.jpg";
import logoImg from "../../assets/logo.png";
import BeerCard from "./BeerCard";
import BeerBottomSheet from "./BeerBottomSheet";
import UserDrawer from "../Navigation/UserDrawer";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [{ isLoading, apiData, serverError }] = useFetch();
  const [{ beerData, beerIsLoading }] = useFetchBeers(query);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (serverError === "User doesn't exist") {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [serverError, navigate]);

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (val.trim() === "") {
      setQuery("");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setQuery(searchVal.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setQuery("");
  };

  const handleRefresh = () => {
    // Trigger query update to refetch
    setQuery((prev) => (prev === "" ? " " : ""));
    setTimeout(() => setQuery(""), 50);
  };

  return (
    <div className={styles.appWrapper}>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.mainContainer}>
        {/* Top Header Bar */}
        <header className={styles.topBar}>
          <div className={styles.brandGroup}>
            <div className={styles.brandTitle}>
              <img src={logoImg} alt="Beerdex Logo" className={styles.brandLogo} />
              <span>Beerdex</span>
            </div>
            <div className={styles.greeting}>
              {t("welcome")} <b>{apiData?.username || t("unknown")}</b>
            </div>
          </div>

          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open profile menu"
          >
            <img
              src={apiData?.profile || defaultAvatar}
              alt="Avatar"
              className={styles.avatarImg}
            />
          </button>
        </header>

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t("searchBeer")}
            value={searchVal}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
          {searchVal && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearSearch}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        {/* Beers Feed */}
        <div className={styles.beersFeed}>
          {beerIsLoading ? (
            <div className={styles.loadingState}>
              <p>Ładowanie Twojej kolekcji... 🍺</p>
            </div>
          ) : beerData && beerData.length > 0 ? (
            beerData.map((beer) => (
              <BeerCard
                key={beer._id}
                beerName={beer.beerName}
                beerVariant={beer.beerVariant}
                beerDescription={beer.beerDescription}
                beerRating={beer.beerRating}
                beerPhoto={beer.beerPhoto}
                beerDate={beer.beerDate}
                beerVerticalStyle={beer.beerVerticalStyle}
                beerHorizontalStyle={beer.beerHorizontalStyle}
                beerWidthStyle={beer.beerWidthStyle}
                onDeleted={handleRefresh}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🍻</div>
              <h3>{t("noBeersYet")}</h3>
              <p>
                {query
                  ? t("toastSearchBeerError")
                  : "Twój Beerdex jest pusty. Złap swoje pierwsze piwo, klikając zielony przycisk plusa poniżej!"}
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) */}
        <button
          type="button"
          className={styles.fabButton}
          onClick={() => setIsSheetOpen(true)}
          aria-label="Add Beer"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* User Navigation Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={apiData}
        onLogout={userLogout}
      />

      {/* Bottom Sheet for adding beer */}
      <BeerBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onBeerAdded={handleRefresh}
      />
    </div>
  );
}

export default Home;
