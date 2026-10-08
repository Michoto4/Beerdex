import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.scss";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/fetch.hook";
import useInfiniteBeers from "../../hooks/useInfiniteBeers.hook";
import defaultAvatar from "../../assets/default.jpg";
import logoImg from "../../assets/logo.png";
import BeerCard from "./BeerCard";
import BeerBottomSheet from "./BeerBottomSheet";
import UserDrawer from "../Navigation/UserDrawer";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowDownWideShort,
  faCheck,
  faClock,
  faStar,
  faArrowDownAZ,
  faArrowUpAZ,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [sortOption, setSortOption] = useState("date_desc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortMenuRef = useRef(null);
  const sentinelRef = useRef(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBeer, setEditingBeer] = useState(null);

  const [{ apiData, serverError }] = useFetch();
  const {
    beers,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    refetch,
    updateLocalBeer,
    removeLocalBeer,
  } = useInfiniteBeers(query, sortOption, refreshKey);

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

  // Close sort menu on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSortOpen]);

  // Infinite Scroll IntersectionObserver on sentinelRef
  useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "300px" } // Preload when 300px away from bottom
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

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
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenAdd = () => {
    setEditingBeer(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (beer) => {
    setEditingBeer(beer);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingBeer(null);
  };

  return (
    <div className={styles.appWrapper}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sticky Header with Brand Bar, Search Bar and Sort Button */}
      <div className={styles.stickyHeader}>
        <div className={styles.stickyHeaderInner}>
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

          {/* Search Bar + Sort Action Row */}
          <div className={styles.searchControlsRow}>
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
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>

            {/* Sort Button and Dropdown Menu */}
            <div className={styles.sortWrapper} ref={sortMenuRef}>
              <button
                type="button"
                className={`${styles.sortBtn} ${isSortOpen ? styles.sortBtnActive : ""} ${
                  sortOption !== "date_desc" ? styles.sortBtnModified : ""
                }`}
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-label={t("sort")}
                title={t("sort")}
              >
                <FontAwesomeIcon icon={faArrowDownWideShort} />
                <span className={styles.sortBtnText}>{t("sort")}</span>
                {sortOption !== "date_desc" && <span className={styles.activeDot} />}
              </button>

              {isSortOpen && (
                <div className={styles.sortDropdown}>
                  <div className={styles.sortHeader}>{t("sortBy")}</div>

                  {/* Date Added */}
                  <div className={styles.sortGroup}>
                    <div className={styles.sortGroupTitle}>{t("dateAdded")}</div>
                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "date_desc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("date_desc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faClock} className={styles.optionIcon} />
                        <span>{t("sortNewest")}</span>
                      </div>
                      {sortOption === "date_desc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>

                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "date_asc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("date_asc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faClock} className={styles.optionIcon} />
                        <span>{t("sortOldest")}</span>
                      </div>
                      {sortOption === "date_asc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>
                  </div>

                  <div className={styles.sortDivider} />

                  {/* Beer Rating */}
                  <div className={styles.sortGroup}>
                    <div className={styles.sortGroupTitle}>{t("beerRatingSort")}</div>
                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "rating_desc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("rating_desc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faStar} className={styles.optionIcon} />
                        <span>{t("sortRatingDesc")}</span>
                      </div>
                      {sortOption === "rating_desc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>

                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "rating_asc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("rating_asc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faStar} className={styles.optionIcon} />
                        <span>{t("sortRatingAsc")}</span>
                      </div>
                      {sortOption === "rating_asc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>
                  </div>

                  <div className={styles.sortDivider} />

                  {/* Alphabetical */}
                  <div className={styles.sortGroup}>
                    <div className={styles.sortGroupTitle}>{t("alphabetical")}</div>
                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "name_asc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("name_asc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faArrowDownAZ} className={styles.optionIcon} />
                        <span>{t("sortNameAsc")}</span>
                      </div>
                      {sortOption === "name_asc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>

                    <button
                      type="button"
                      className={`${styles.sortOptionItem} ${
                        sortOption === "name_desc" ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSortOption("name_desc");
                        setIsSortOpen(false);
                      }}
                    >
                      <div className={styles.optionLabel}>
                        <FontAwesomeIcon icon={faArrowUpAZ} className={styles.optionIcon} />
                        <span>{t("sortNameDesc")}</span>
                      </div>
                      {sortOption === "name_desc" && (
                        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        {/* Beers Feed */}
        <div className={styles.beersFeed}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner} />
              <p>Ładowanie Twojej kolekcji... 🍺</p>
            </div>
          ) : beers && beers.length > 0 ? (
            beers.map((beer, index) => (
              <BeerCard
                key={beer._id}
                beerName={beer.beerName}
                beerVariant={beer.beerVariant}
                beerDescription={beer.beerDescription}
                beerRating={beer.beerRating}
                beerPhoto={beer.beerPhoto}
                beerDate={beer.beerDate}
                onEdit={() => handleOpenEdit(beer)}
                style={{ animationDelay: `${Math.min((index % 12) * 35, 350)}ms` }}
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

        {/* Sentinel element for infinite scroll observer */}
        <div ref={sentinelRef} className={styles.sentinel} />

        {/* Loading More Spinner Indicator */}
        {isLoadingMore && (
          <div className={styles.loadingMore}>
            <div className={styles.loadingSpinner} />
            <span>{t("loadingMoreBeers")}</span>
          </div>
        )}

        {/* End of feed indicator */}
        {!hasMore && beers.length > 0 && (
          <div className={styles.endOfFeed}>
            <span>{t("allBeersLoaded")} 🍻</span>
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <button
          type="button"
          className={styles.fabButton}
          onClick={handleOpenAdd}
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

      {/* Bottom Sheet for adding & editing beer */}
      <BeerBottomSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        beer={editingBeer}
        onBeerAdded={handleRefresh}
        onBeerUpdated={(updated) => {
          updateLocalBeer(updated);
        }}
        onBeerDeleted={(deletedId) => {
          removeLocalBeer(deletedId);
        }}
      />
    </div>
  );
}

export default Home;
