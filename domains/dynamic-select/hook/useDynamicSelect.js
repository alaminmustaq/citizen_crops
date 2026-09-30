import { useState, useCallback, useMemo, useEffect } from "react";
import { debounce } from "@/utility/helpers";
import { useLazyDynamicSelectSearchQuery } from "../services/dynamicSelectApi";
import * as templateHelper from "@/utility/templateHelper";

export const useDynamicSelect = (
  defaultTemplate = "commonSearchTemplate",
  debounceDelay = 500,
  loadOptions = [], // [urlValue, dataKey, transformer, dependencyKey]
  form
) => {
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");

  const [urlValue, dataKey, transformer = defaultTemplate, dependencyKey] = loadOptions;   
  
  // ✅ lazy query trigger
  const [triggerSearch, { data: dynamicSearch, isLoading }] = useLazyDynamicSelectSearchQuery();

  // transform API results using template
  const transformResults = useCallback(
    (results) => {
      const fn = templateHelper[transformer];
      return typeof fn === "function" ? fn(results) : results;
    },
    [transformer]
  );

  // get current value of parent (dependency)
  const watchedDep = dependencyKey ? form.watch(dependencyKey) : null;
  const dependencyValue = useMemo(() => {
    if (!dependencyKey) return true;
    if (Array.isArray(dependencyKey)) {
      const firstVal = Array.isArray(watchedDep) ? watchedDep[0] : form.getValues(dependencyKey[0]);
      const raw = firstVal?.value ?? firstVal;
      return raw && raw !== "null" && raw !== "undefined";
    }
    const val = watchedDep ?? form.getValues(dependencyKey);
    const raw = val?.value ?? val;
    return raw && raw !== "null" && raw !== "undefined";
  }, [dependencyKey, watchedDep, form]);

  // memoized transformed results
  const transformed = useMemo(() => {
    const results = dynamicSearch?.data?.[dataKey] ?? [];
    return transformResults(results);
  }, [dynamicSearch, dataKey, transformResults]);

  // manual trigger (like getMe) 
  const runTrigger = useCallback(
    async (customSearch = "") => {
      try {
        let dependencyData = {};

        if (dependencyKey) {
          const keys = Array.isArray(dependencyKey) ? dependencyKey : [dependencyKey];

          keys.forEach((key) => {
            const value = form.getValues(key);
            if (value !== undefined && value !== null) {
              const rawVal = value?.value ?? value;
              if (rawVal !== "null" && rawVal !== "undefined" && rawVal !== "") {
                dependencyData[key] = rawVal;
              }
            }
          });
        }

        const response = await triggerSearch({
          data: {
            search: customSearch,
            url: urlValue, 
            isActive: true,
            ...dependencyData,
          },
        }).unwrap();

        return { success: true, data: response };
      } catch (error) {
        return { success: false, error };
      }
    },
    [triggerSearch, urlValue, dependencyKey, form]
  );


  // debounced search for async-select
  const onSearch = useMemo(
    () =>
      debounce(async (inputValue, callback) => {
        setSearch(inputValue);
        setUrl(urlValue);

        const result = await runTrigger(inputValue);
        if (result.success) {
          callback(transformResults(result.data?.data?.[dataKey] ?? []));
        }
      }, debounceDelay),
    [runTrigger, transformResults, debounceDelay, urlValue, dataKey]
  );

  // load data on dropdown open
  const onLoadData = useCallback(async () => { 
    setSearch("");
    setUrl(urlValue);

    // no parent selected → return empty without firing request
    if (dependencyKey && !dependencyValue) return [];

    const result = await runTrigger("");
    if (result.success) {
      return transformResults(result.data?.data?.[dataKey] ?? []);
    }
    return [];
  }, [runTrigger, urlValue, dependencyKey, dependencyValue, transformResults, dataKey]);

  return {
    actions: { onSearch, onLoadData, runTrigger },
    isLoading,
    transformed,
  };
};
