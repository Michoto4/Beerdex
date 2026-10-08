import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import ENV from "../config";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = ENV.BASE_URL;

const LIMIT = 12; // 12 beers per page

/**
 * Hook for server-side paginated and sorted beer loading (Infinite Scroll)
 */
export default function useInfiniteBeers(query, sortOption, refreshKey) {
  const [beers, setBeers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Keep track of active request ID to ignore stale responses
  const activeReqId = useRef(0);

  const fetchPage = useCallback(
    async (targetPage, isReset = false) => {
      const reqId = ++activeReqId.current;
      try {
        if (isReset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const { username } = await getUsername();
        if (!username) return;

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const isSearch = Boolean(query && query.trim() !== "");
        const url = isSearch
          ? `/api/searchBeer/${username}/${encodeURIComponent(query.trim())}`
          : `/api/getBeers/${username}`;

        const res = await axios.get(url, {
          params: {
            page: targetPage,
            limit: LIMIT,
            sort: sortOption || "date_desc",
          },
          headers,
        });

        // Ignore if a newer request was dispatched
        if (reqId !== activeReqId.current) return;

        if (res.status === 200 || res.status === 201) {
          const data = res.data;
          const newBeers = Array.isArray(data) ? data : data.beers || [];
          const totalCount =
            data.total !== undefined ? data.total : newBeers.length;
          const moreAvailable =
            data.hasMore !== undefined
              ? data.hasMore
              : newBeers.length === LIMIT;

          setTotal(totalCount);
          setHasMore(moreAvailable);
          setPage(targetPage);

          if (isReset) {
            setBeers(newBeers);
          } else {
            setBeers((prev) => {
              // Deduplicate by _id to avoid duplicate keys
              const existingIds = new Set(prev.map((b) => b._id));
              const filteredNew = newBeers.filter((b) => !existingIds.has(b._id));
              return [...prev, ...filteredNew];
            });
          }
        }
      } catch (err) {
        if (reqId === activeReqId.current) {
          setError(err);
        }
      } finally {
        if (reqId === activeReqId.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [query, sortOption]
  );

  // When query, sortOption, or refreshKey changes, reset and fetch page 1
  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage, refreshKey]);

  // Load next page
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) return;
    fetchPage(page + 1, false);
  }, [hasMore, isLoading, isLoadingMore, page, fetchPage]);

  const refetch = useCallback(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  // Optimistically update a beer in local state
  const updateLocalBeer = useCallback((updatedBeer) => {
    setBeers((prev) =>
      prev.map((b) => (b._id === updatedBeer._id ? { ...b, ...updatedBeer } : b))
    );
  }, []);

  // Optimistically remove a beer from local state
  const removeLocalBeer = useCallback((beerId) => {
    setBeers((prev) => prev.filter((b) => b._id !== beerId));
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    beers,
    total,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    refetch,
    updateLocalBeer,
    removeLocalBeer,
  };
}
