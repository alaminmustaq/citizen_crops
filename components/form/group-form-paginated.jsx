"use client";

import * as React from "react";
import { useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2, Search } from "lucide-react";
import { useGroupFormPaginated } from "@/domains/group-form-paginated/hook/useGroupFormPaginated";
import FieldRenderer from "./field-renderer";

const GroupFormPaginatedField = ({ fieldConfig, form, addButtonLabel }) => {
    const {
        name,
        fields: childFields,
        label,
        isDelete = true,
        maxHeight = "400px",
        loadMoreLabel = "Load More",
        loadOptions = [], // [url, dataKey, dataMapper, filterFields]
        perPage = 10,
        autoLoad = false,
        enableSearch = true,
        searchPlaceholder = "Search...",
        searchFields = [], // Fields to search in (e.g., ["employee_name", "employee_email"])
    } = fieldConfig;

    // Use the fieldArray methods from the form
    const { fields, append, remove, replace } = form.fields;
    const observerTarget = useRef(null);
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const prevSearchTermRef = useRef("");

    // State to remember checked/selected items by their unique ID
    const [editedRows, setEditedRows] = useState({});
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Helper to get unique identifier from item
    const getItemId = React.useCallback(
        (item) => {
            // Use id as primary identifier
            if (!item) return null;
            return item.id || null;
        },
        [childFields],
    );

    // Use pagination hook
    const {
        loadData,
        loadMore,
        resetAndLoad,
        paginationState,
        searchTerm: hookSearchTerm,
        setSearchTerm: setHookSearchTerm,
        serverSideSearch,
    } = useGroupFormPaginated({
        loadOptions,
        form,
        perPage,
        autoLoad,
        serverSideSearch: enableSearch,
    });

    // Use hook's search term if server-side search is enabled
    const currentSearchTerm = serverSideSearch ? hookSearchTerm : searchTerm;

    const addNewItem = () => {
        const defaultItem = {};
        childFields.forEach((field) => {
            defaultItem[field.name] = field.type === "checkbox" ? false : "";
        });
        append(defaultItem);
    };

    // Client-side filtering (only if server-side search is disabled)
    const filteredFields = useMemo(() => {
        if (serverSideSearch || !enableSearch || !searchTerm) {
            return fields;
        }

        const searchLower = searchTerm.toLowerCase();
        const allFormValues = form.getValues(name) || [];

        return fields.filter((item, index) => {
            const itemData = allFormValues[index];
            if (!itemData) return false;

            // If searchFields specified, only search in those fields
            if (searchFields.length > 0) {
                return searchFields.some((fieldName) => {
                    const value = itemData[fieldName];
                    return (
                        value &&
                        String(value).toLowerCase().includes(searchLower)
                    );
                });
            }

            // Otherwise search in all string/number fields (excluding checkbox)
            return Object.entries(itemData).some(([key, value]) => {
                // Skip checkbox fields for general search
                if (key === "is_selected") return false;
                if (typeof value === "string" || typeof value === "number") {
                    return String(value).toLowerCase().includes(searchLower);
                }
                return false;
            });
        });
    }, [
        fields,
        searchTerm,
        enableSearch,
        form,
        name,
        searchFields,
        serverSideSearch,
    ]);

    // Handle load more with append to form
    const handleLoadMore = React.useCallback(async () => {
        const result = await loadMore();
        if (result?.items && result.items.length > 0) {
            // Get existing items to avoid duplicates
            const existingItems = form.getValues(name) || [];
            const existingIds = existingItems.map((item) => getItemId(item));

            const newItems = result.items.filter(
                (item) => !existingIds.includes(getItemId(item)),
            );

            if (newItems.length > 0) {
                // Restore checked state from saved selections
                const itemsWithState = newItems.map((item) => {
                    const itemId = getItemId(item);
                    const oldEdits = editedRows[itemId] || {};

                    return {
                        ...item,
                        ...oldEdits, // 🔥 restore amount, status, etc.
                        is_selected: itemId ? selectedItems.has(itemId) : false,
                    };
                });
                itemsWithState.forEach((item) => {
                    append(item);
                });
            }
        }
    }, [loadMore, form, name, append, getItemId, selectedItems, editedRows]);

    // Handle initial load
    const handleInitialLoad = React.useCallback(async () => {
        const result = await resetAndLoad();

        if (result?.items && result.items.length > 0) {
            const itemsWithState = result.items.map((item) => {
                const itemId = getItemId(item);
                const oldEdits = editedRows[itemId] || {};

                return {
                    ...item,
                    ...oldEdits, // 🔥 restore amount, status, etc.
                    is_selected: itemId ? selectedItems.has(itemId) : false,
                };
            });

            replace(itemsWithState);
        } else {
            replace([]);
        }
    }, [resetAndLoad, replace, selectedItems, editedRows, getItemId]);

    // Handle server-side search
    const handleServerSearch = React.useCallback(
        async (searchValue) => {
            const result = await loadData(1, false, searchValue);

            if (result?.items && result.items.length > 0) {
                const itemsWithState = result.items.map((item) => {
                    const itemId = getItemId(item);
                    const oldEdits = editedRows[itemId] || {};

                    return {
                        ...item,
                        ...oldEdits,
                        is_selected: itemId ? selectedItems.has(itemId) : false,
                    };
                });

                replace(itemsWithState);
            } else {
                replace([]);
            }
        },
        [loadData, replace, selectedItems, editedRows, getItemId],
    );

    // Effect to trigger server-side search when search term changes
    React.useEffect(() => {
        if (serverSideSearch && hookSearchTerm !== undefined) {
            // Only trigger search if search term actually changed (not on initial mount)
            if (hookSearchTerm === prevSearchTermRef.current) {
                return;
            }

            prevSearchTermRef.current = hookSearchTerm;

            const timeoutId = setTimeout(() => {
                // If search is cleared (empty), reload all data
                if (hookSearchTerm === "" || hookSearchTerm.trim() === "") {
                    handleInitialLoad();
                } else {
                    handleServerSearch(hookSearchTerm);
                }
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [
        hookSearchTerm,
        serverSideSearch,
        handleServerSearch,
        handleInitialLoad,
    ]);

    // Watch for checkbox changes and update selectedItems state
    React.useEffect(() => {
        const subscription = form.watch((value, { name: fieldName }) => {
            if (!fieldName || !fieldName.startsWith(`${name}.`)) return;

            const parts = fieldName.split(".");
            const index = parseInt(parts[1]);
            const fieldKey = parts[2]; // amount, status, is_selected

            const allValues = form.getValues(name) || [];
            const item = allValues[index];
            if (!item) return;

            const itemId = getItemId(item);
            if (!itemId) return;

            // 🔥 HANDLE CHECKBOX (existing logic)
            if (fieldKey === "is_selected") {
                setSelectedItems((prev) => {
                    const newSet = new Set(prev);
                    item.is_selected
                        ? newSet.add(itemId)
                        : newSet.delete(itemId);
                    return newSet;
                });
                return;
            }

            // 🔥 HANDLE OTHER FIELDS (NEW)
            setEditedRows((prev) => ({
                ...prev,
                [itemId]: {
                    ...prev[itemId],
                    [fieldKey]: item[fieldKey],
                },
            }));
        });

        return () => subscription.unsubscribe();
    }, [form, name, getItemId]);

    // Auto load on mount if enabled
    React.useEffect(() => {
        if (autoLoad) {
            handleInitialLoad();
        }
    }, [autoLoad]); // Only run on mount

    // Expose load function and update selectedData
    React.useEffect(() => {
        if (form && name) {
            // Store load function in form context for external triggers
            if (!form._paginatedLoaders) {
                form._paginatedLoaders = {};
            }
            form._paginatedLoaders[name] = handleInitialLoad;

            // Initialize selectedData
            if (!form.selectedData) {
                form.selectedData = {};
            }

            // Add selectedItems to form using setValue
            form.setValue("selectedId", selectedItems, {
                shouldValidate: false,
                shouldDirty: false,
            });

            // Update selectedData whenever selectedItems changes
            const allValues = form.getValues(name) || [];
            const selectedData = allValues.filter((item) => {
                const itemId = getItemId(item);
                return itemId && selectedItems.has(itemId);
            });

            form.selectedData[name] = {
                ids: Array.from(selectedItems),
                items: selectedData,
                count: selectedItems.size,
            };

            return () => {
                if (form._paginatedLoaders) {
                    delete form._paginatedLoaders[name];
                }
            };
        }
    }, [form, name, handleInitialLoad, selectedItems, getItemId]);

    // Intersection Observer for infinite scroll
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    paginationState.hasMore &&
                    !paginationState.isLoading
                ) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1 },
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [paginationState.hasMore, paginationState.isLoading, handleLoadMore]);

    return (
        <div className="space-y-4">
            {/* Search Input */}
            {enableSearch && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={currentSearchTerm || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (serverSideSearch) {
                                setHookSearchTerm(value);
                            } else {
                                setSearchTerm(value);
                            }
                        }}
                        className="pl-10"
                    />
                </div>
            )}

            {/* Scrollable container */}
            <div
                ref={containerRef}
                className="space-y-4"
                style={{ maxHeight }}
            >
                {filteredFields.length === 0 && currentSearchTerm ? (
                    <div className="text-center py-8 text-muted-foreground">
                        {paginationState.isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            `No results found for "${currentSearchTerm}"`
                        )}
                    </div>
                ) : (
                    filteredFields.map((item, index) => {
                        // Find original index in fields array
                        const originalIndex = fields.findIndex(
                            (f) => f.id === item.id,
                        );
                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 gap-4"
                            >
                                {childFields.map((childField) => {
                                    const fieldName = `${name}.${originalIndex}.${childField.name}`;
                                    const isVisible =
                                        typeof childField.visibility ===
                                        "function"
                                            ? !!childField.visibility(index)
                                            : (childField.visibility ?? true);

                                    if (isVisible === false) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={childField.name}
                                            className={cn(
                                                childField.colSpan ||
                                                    "col-span-12",
                                            )}
                                        >
                                            <FieldRenderer
                                                fieldConfig={{
                                                    ...childField,
                                                    name: fieldName,
                                                    index: originalIndex,
                                                }}
                                                form={form}
                                            />
                                        </div>
                                    );
                                })}
                                {isDelete && (
                                    <div className="col-span-2 md:col-span-1 flex justify-end">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() =>
                                                remove(originalIndex)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {/* Loading indicator and load more trigger */}
                {paginationState.hasMore && (
                    <div
                        ref={observerTarget}
                        className="flex justify-center py-4"
                    >
                        {paginationState.isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading more...</span>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleLoadMore}
                                className="flex items-center gap-1"
                            >
                                {loadMoreLabel}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Add Button */}
            {addButtonLabel && (
                <div className="flex justify-start pt-2">
                    <Button
                        type="button"
                        size="sm"
                        onClick={addNewItem}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                        <Plus className="w-4 h-4" />
                        {addButtonLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GroupFormPaginatedField;
