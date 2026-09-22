import { useState, useCallback, useEffect, useRef } from "react";
import { useLazyLoadPaginatedDataQuery } from "../services/groupFormPaginatedApi";
import toast from "react-hot-toast";

export const useGroupFormPaginated = ({
    loadOptions = [], // [url, dataKey, dataMapper, filterFields]
    form,
    perPage = 10,
    autoLoad = false,
    serverSideSearch = true,
    searchKey = "search", // API parameter name for search
}) => {
    const [url, dataKey, dataMapper, filterFields = []] = loadOptions;
    
    const [paginationState, setPaginationState] = useState({
        currentPage: 1,
        hasMore: false,
        isLoading: false,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [triggerLoad] = useLazyLoadPaginatedDataQuery();

    // Build filter params from form values
    const buildFilters = useCallback(() => {
        const formValues = form.getValues();
        const filters = {};
        
        if (Array.isArray(filterFields)) {
            filterFields.forEach(fieldName => {
                const value = formValues[fieldName];
                // Extract value from select object if needed
                filters[fieldName] = value?.value || value || null;
            });
        }
        
        return filters;
    }, [form, filterFields]);

    // Load data function
    const loadData = useCallback(async (page = 1, append = false, search = null) => {
        if (!url) {
            console.warn("No URL provided for paginated data loading");
            return;
        }

        try {
            setPaginationState(prev => ({ ...prev, isLoading: true }));

            const filters = buildFilters();
            const params = {
                ...filters,
                page: page,
                per_page: perPage,
                isActive: true,
            };

            // Add search parameter if provided
            if (search !== null && search.trim() !== "") {
                params[searchKey] = search.trim();
            }

            const response = await triggerLoad({
                url: url,
                params: params,
            }).unwrap();

            if (response?.data) {
                const items = Array.isArray(response.data) 
                    ? response.data 
                    : response.data[dataKey] || response.data.items || [];
                
                const pagination = response.pagination || response.data?.pagination || {};

                if (items.length === 0) {
                    setPaginationState(prev => ({
                        ...prev,
                        isLoading: false,
                        hasMore: false,
                    }));
                    if (!append) {
                        toast.error("No data found");
                    }
                    return { items: [], hasMore: false };
                }

                // Map data using dataMapper function if provided
                const mappedItems = dataMapper 
                    ? items.map(item => dataMapper(item))
                    : items;

                // Update pagination state
                setPaginationState({
                    currentPage: page,
                    hasMore: pagination.current_page < pagination.last_page,
                    isLoading: false,
                });

                return {
                    items: mappedItems,
                    hasMore: pagination.current_page < pagination.last_page,
                };
            }

            setPaginationState(prev => ({ ...prev, isLoading: false }));
            return { items: [], hasMore: false };
        } catch (error) {
            console.error("Error loading paginated data:", error);
            toast.error(error?.data?.message || "Failed to load data");
            setPaginationState(prev => ({ ...prev, isLoading: false }));
            return { items: [], hasMore: false };
        }
    }, [url, dataKey, dataMapper, perPage, triggerLoad, buildFilters, searchKey]);

    // Load more function (for pagination)
    const loadMore = useCallback(async () => {
        if (paginationState.isLoading || !paginationState.hasMore) return;
        
        const nextPage = paginationState.currentPage + 1;
        return await loadData(nextPage, true, searchTerm);
    }, [paginationState, loadData, searchTerm]);

    // Reset pagination (for initial load)
    const resetAndLoad = useCallback(async (search = null) => {
        setPaginationState({
            currentPage: 1,
            hasMore: false,
            isLoading: false,
        });
        const searchValue = search !== null ? search : searchTerm;
        return await loadData(1, false, searchValue);
    }, [loadData, searchTerm]);

    return {
        loadData,
        loadMore,
        resetAndLoad,
        paginationState,
        searchTerm,
        setSearchTerm,
        serverSideSearch,
    };
};

